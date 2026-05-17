use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
use machine_uid;
// use reqwest::blocking::Client;
// use chrono::prelude::*;

const LICENSE_API_URL: &str = "https://electron-licensing-server.vercel.app/api/verify";
const SOFTWARE_TYPE: &str = "Loomix";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LicenseData {
    pub key: Option<String>,
    pub status: String, // "active", "invalid", "expired"
    pub last_check: u64,
    pub expiry: Option<u64>,
    pub last_known_date: u64,
}

impl Default for LicenseData {
    fn default() -> Self {
        Self {
            key: None,
            status: "invalid".to_string(),
            last_check: 0,
            expiry: None,
            last_known_date: 0,
        }
    }
}

pub struct LicenseManager {
    path: PathBuf,
    pub machine_id: String,
}

impl LicenseManager {
    pub fn new(app_handle: &AppHandle) -> Self {
        let app_dir = app_handle.path().app_data_dir().expect("failed to get app data dir");
        std::fs::create_dir_all(&app_dir).unwrap();
        let path = app_dir.join("license-data.json");
        
        let machine_id = machine_uid::get().unwrap_or("unknown".to_string());
        
        LicenseManager {
            path,
            machine_id,
        }
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

    pub fn check_tampering(&self) -> bool {
        let mut data = self.load();
        let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

        // 1 hour buffer
        if now < data.last_known_date.saturating_sub(60 * 60 * 1000) {
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
    
    pub async fn activate(&self, key: String) -> Result<String, String> {
        let client = reqwest::Client::new();
        let body = serde_json::json!({
            "licenseKey": key,
            "machineId": self.machine_id,
            "softwareType": SOFTWARE_TYPE
        });

        match client.post(LICENSE_API_URL).json(&body).send().await {
            Ok(resp) => {
                 if resp.status().is_success() {
                     let json: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
                     if json["valid"].as_bool().unwrap_or(false) {
                         let expiry_str = json["expiry"].as_str();
                         let expiry = if let Some(_s) = expiry_str {
                             None 
                         } else {
                             None
                         };
                         
                         let mut data = self.load();
                         data.key = Some(key);
                         data.status = "active".to_string();
                         data.last_check = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
                         data.expiry = expiry;
                         data.last_known_date = data.last_check;
                         self.save(&data);
                         
                         Ok("Activation successful".to_string())
                     } else {
                         Ok(json["message"].as_str().unwrap_or("Invalid key").to_string())
                     }
                 } else {
                     Err(format!("Server error: {}", resp.status()))
                 }
            },
            Err(e) => Err(format!("Network error: {}", e))
        }
    }

    pub async fn check_license(&self) -> bool {
        if self.check_tampering() {
            return false;
        }

        let data = self.load();
        if data.key.is_none() {
            return false;
        }

        // Online check
        let client = reqwest::Client::new();
        let body = serde_json::json!({
            "licenseKey": data.key.unwrap(),
            "machineId": self.machine_id,
            "softwareType": SOFTWARE_TYPE
        });

        match client.post(LICENSE_API_URL).json(&body).timeout(std::time::Duration::from_secs(3)).send().await {
            Ok(resp) => {
                if resp.status().is_success() {
                    let json: serde_json::Value = resp.json().await.unwrap_or(serde_json::Value::Null);
                    if json["valid"].as_bool().unwrap_or(false) {
                         let mut new_data = self.load();
                         new_data.status = "active".to_string();
                         new_data.last_check = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
                         new_data.last_known_date = new_data.last_check;
                         self.save(&new_data);
                         return true;
                    }
                }
            },
            Err(_) => {
                // Network fail
            }
        }
        
        false 
    }
}
