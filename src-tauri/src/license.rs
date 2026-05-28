use chrono::{DateTime, Utc};
use machine_uid;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::AppHandle;
use tauri::Manager;

const SOFTWARE_TYPE: &str = "Loomix";
const PRODUCTION_LICENSE_API_URL: &str =
    "https://rust-licensing-server.yash-v-shinde.workers.dev/api/verify";
const REQUEST_TIMEOUT: Duration = Duration::from_secs(8);
const CLOCK_ROLLBACK_GRACE_MS: u64 = 60 * 60 * 1000;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(default)]
pub struct LicenseData {
    pub key: Option<String>,
    pub status: String,
    pub last_check: u64,
    pub expiry: Option<u64>,
    pub last_known_date: u64,
    pub client_name: Option<String>,
    pub software_type: Option<String>,
    pub plan_type: Option<String>,
}

impl Default for LicenseData {
    fn default() -> Self {
        Self {
            key: None,
            status: "invalid".to_string(),
            last_check: 0,
            expiry: None,
            last_known_date: 0,
            client_name: None,
            software_type: None,
            plan_type: None,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct VerifyResponse {
    valid: bool,
    expiry: Option<String>,
    license: Option<RemoteLicense>,
    message: Option<String>,
    error: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RemoteLicense {
    client_name: Option<String>,
    software_type: String,
    plan_type: Option<String>,
    status: String,
    expires_at: String,
}

pub struct LicenseManager {
    path: PathBuf,
    pub machine_id: String,
}

impl LicenseManager {
    pub fn new(app_handle: &AppHandle) -> Self {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("failed to get app data dir");
        std::fs::create_dir_all(&app_dir).expect("failed to create app data dir");
        let path = app_dir.join("license-data.json");
        let machine_id = machine_uid::get().unwrap_or_else(|_| "unknown".to_string());

        LicenseManager { path, machine_id }
    }

    fn load(&self) -> LicenseData {
        if let Ok(content) = fs::read_to_string(&self.path) {
            if let Ok(data) = serde_json::from_str::<LicenseData>(&content) {
                return data;
            }
        }
        LicenseData::default()
    }

    fn save(&self, data: &LicenseData) {
        if let Ok(content) = serde_json::to_string_pretty(data) {
            let _ = fs::write(&self.path, content);
        }
    }

    pub fn get_status(&self) -> LicenseData {
        self.load()
    }

    fn now_millis() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64
    }

    fn parse_time_millis(value: &str) -> Option<u64> {
        DateTime::parse_from_rfc3339(value)
            .ok()
            .map(|dt| dt.with_timezone(&Utc).timestamp_millis().max(0) as u64)
    }

    fn normalize_key(key: &str) -> String {
        key.trim().to_ascii_uppercase()
    }

    fn license_api_url() -> &'static str {
        option_env!("LICENSE_API_URL").unwrap_or(if cfg!(debug_assertions) {
            "http://127.0.0.1:8787/api/verify"
        } else {
            PRODUCTION_LICENSE_API_URL
        })
    }

    fn mark_invalid(&self, status: &str) {
        let mut data = self.load();
        data.status = status.to_string();
        self.save(&data);
    }

    pub fn check_tampering(&self) -> bool {
        let mut data = self.load();
        let now = Self::now_millis();

        if data.last_known_date > 0
            && now < data.last_known_date.saturating_sub(CLOCK_ROLLBACK_GRACE_MS)
        {
            data.status = "invalid".to_string();
            self.save(&data);
            return true;
        }

        if now > data.last_known_date {
            data.last_known_date = now;
            self.save(&data);
        }
        false
    }

    fn persist_success(&self, key: String, response: VerifyResponse) -> Result<(), String> {
        let license = response.license.ok_or("Malformed license response")?;
        if !response.valid || license.status != "active" {
            return Err(response
                .message
                .unwrap_or_else(|| "License is not active".to_string()));
        }
        if license.software_type != SOFTWARE_TYPE {
            return Err(format!(
                "License is for {}, not {}",
                license.software_type, SOFTWARE_TYPE
            ));
        }

        let expiry = response
            .expiry
            .as_deref()
            .and_then(Self::parse_time_millis)
            .or_else(|| Self::parse_time_millis(&license.expires_at));
        let now = Self::now_millis();
        if let Some(expires_at) = expiry {
            if expires_at <= now {
                self.mark_invalid("expired");
                return Err("License expired".to_string());
            }
        }

        let data = LicenseData {
            key: Some(key),
            status: "active".to_string(),
            last_check: now,
            expiry,
            last_known_date: now,
            client_name: license.client_name,
            software_type: Some(license.software_type),
            plan_type: license.plan_type,
        };
        self.save(&data);
        Ok(())
    }

    async fn verify_remote(&self, key: &str) -> Result<VerifyResponse, String> {
        if self.machine_id == "unknown" {
            return Err("Unable to read this device ID for license binding".to_string());
        }

        let client = reqwest::Client::builder()
            .timeout(REQUEST_TIMEOUT)
            .build()
            .map_err(|e| e.to_string())?;
        let body = serde_json::json!({
            "licenseKey": key,
            "machineId": self.machine_id,
            "softwareType": SOFTWARE_TYPE
        });

        let response = client
            .post(Self::license_api_url())
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Could not reach licensing server: {}", e))?;
        let status = response.status();
        let text = response.text().await.map_err(|e| e.to_string())?;
        let parsed: VerifyResponse = serde_json::from_str(&text)
            .map_err(|_| format!("Unexpected licensing server response ({})", status))?;

        if !status.is_success() {
            return Err(parsed
                .error
                .or(parsed.message)
                .unwrap_or_else(|| format!("License rejected by server ({})", status)));
        }

        Ok(parsed)
    }

    pub async fn activate(&self, key: String) -> Result<String, String> {
        let normalized_key = Self::normalize_key(&key);
        let response = self.verify_remote(&normalized_key).await?;
        self.persist_success(normalized_key, response)?;
        Ok("Activation successful".to_string())
    }

    pub async fn check_license(&self) -> bool {
        if self.check_tampering() {
            return false;
        }

        let data = self.load();
        let Some(key) = data.key else {
            return false;
        };

        if let Some(expiry) = data.expiry {
            if expiry <= Self::now_millis() {
                self.mark_invalid("expired");
                return false;
            }
        }

        match self.verify_remote(&key).await {
            Ok(response) => self.persist_success(key, response).is_ok(),
            Err(_) => false,
        }
    }
}
