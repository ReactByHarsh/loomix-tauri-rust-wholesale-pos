use tauri::Manager;
use tauri::State;

mod db;
mod license;

use db::{
    Database, FullBackup, Product, TransactionBackup, TransactionData, TransactionDetails,
    TransactionHistoryResponse,
};
use license::LicenseManager;

// --- Database Commands ---

#[tauri::command]
fn get_transaction_history(
    db: State<Database>,
    page: i32,
    page_size: i32,
    search: Option<String>,
    payment_filter: Option<String>,
    date_filter: Option<String>,
) -> Result<TransactionHistoryResponse, String> {
    db.get_transaction_history(
        page,
        page_size,
        search.unwrap_or_default(),
        payment_filter.unwrap_or("all".to_string()),
        date_filter.unwrap_or("all".to_string()),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_transaction_by_id(
    db: State<Database>,
    id: i32,
) -> Result<Option<TransactionDetails>, String> {
    db.get_transaction_by_id(id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_products(
    db: State<Database>,
    page: i32,
    page_size: i32,
    search: Option<String>,
    category: Option<String>,
) -> Result<Vec<Product>, String> {
    db.get_products(
        page,
        page_size,
        search.unwrap_or_default(),
        category.unwrap_or("all".to_string()),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_products_count(
    db: State<Database>,
    search: Option<String>,
    category: Option<String>,
) -> Result<i32, String> {
    db.get_products_count(
        search.unwrap_or_default(),
        category.unwrap_or("all".to_string()),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_product_by_sku(db: State<Database>, sku: String) -> Result<Option<Product>, String> {
    db.get_product_by_sku(sku).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_product(db: State<Database>, product: Product) -> Result<serde_json::Value, String> {
    match db.add_product(product) {
        Ok(id) => Ok(serde_json::json!({ "success": true, "id": id })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn update_product(db: State<Database>, product: Product) -> Result<(), String> {
    db.update_product(product).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_product(db: State<Database>, id: i32) -> Result<(), String> {
    db.delete_product(id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_transaction(
    db: State<Database>,
    data: TransactionData,
) -> Result<serde_json::Value, String> {
    match db.create_transaction(data) {
        Ok(id) => Ok(serde_json::json!({ "success": true, "id": id })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn get_dashboard_stats(db: State<Database>) -> Result<serde_json::Value, String> {
    match db.get_dashboard_stats() {
        Ok(stats) => Ok(serde_json::json!({ "stats": stats, "chart": stats.chart_data })), // Adjust structure to match frontend expectation
        Err(e) => Err(e.to_string()),
    }
}

// --- Vendor Commands ---

#[tauri::command]
fn get_vendor_profiles(db: State<Database>) -> Result<Vec<db::VendorProfile>, String> {
    db.get_vendor_profiles().map_err(|e| e.to_string())
}

#[tauri::command]
fn add_vendor_profile(
    db: State<Database>,
    profile: db::VendorProfile,
) -> Result<serde_json::Value, String> {
    match db.add_vendor_profile(profile) {
        Ok(id) => Ok(serde_json::json!({ "success": true, "data": { "lastInsertRowid": id } })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn get_vendors(
    db: State<Database>,
    page: i32,
    page_size: i32,
    search: Option<String>,
    date_filter: Option<String>,
    vendor_id: Option<i32>,
) -> Result<db::VendorListResponse, String> {
    db.get_vendors(
        page,
        page_size,
        search.unwrap_or_default(),
        date_filter.unwrap_or("all".to_string()),
        vendor_id,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_vendor_stats(
    db: State<Database>,
    vendor_id: Option<i32>,
) -> Result<db::VendorStats, String> {
    db.get_vendor_stats(vendor_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_vendor(db: State<Database>, record: db::VendorRecord) -> Result<serde_json::Value, String> {
    match db.add_vendor(record) {
        Ok(id) => Ok(serde_json::json!({ "success": true, "id": id })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn update_vendor(
    db: State<Database>,
    record: db::VendorRecord,
) -> Result<serde_json::Value, String> {
    match db.update_vendor(record) {
        Ok(_) => Ok(serde_json::json!({ "success": true })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn delete_vendor(db: State<Database>, id: i32) -> Result<(), String> {
    db.delete_vendor(id).map_err(|e| e.to_string())
}

#[tauri::command]
fn export_products(db: State<Database>) -> Result<serde_json::Value, String> {
    match db.export_products() {
        Ok(data) => Ok(serde_json::json!({ "success": true, "data": data })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn import_products(
    db: State<Database>,
    products: Vec<Product>,
) -> Result<serde_json::Value, String> {
    match db.import_products(products) {
        Ok(imported) => Ok(serde_json::json!({ "success": true, "imported": imported })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn restore_products_backup(
    db: State<Database>,
    products: Vec<Product>,
) -> Result<serde_json::Value, String> {
    match db.restore_products_backup(products) {
        Ok(_) => Ok(serde_json::json!({ "success": true })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn export_transactions(db: State<Database>) -> Result<serde_json::Value, String> {
    match db.export_transactions_flat() {
        Ok(data) => Ok(serde_json::json!({ "success": true, "data": data })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn export_transaction_backup(db: State<Database>) -> Result<TransactionBackup, String> {
    db.export_transaction_backup().map_err(|e| e.to_string())
}

#[tauri::command]
fn restore_transaction_backup(
    db: State<Database>,
    backup: TransactionBackup,
) -> Result<serde_json::Value, String> {
    match db.restore_transaction_backup(backup) {
        Ok(_) => Ok(serde_json::json!({ "success": true })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn clear_transaction_history(db: State<Database>) -> Result<serde_json::Value, String> {
    match db.clear_transaction_history() {
        Ok(_) => Ok(serde_json::json!({ "success": true })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[tauri::command]
fn export_full_backup(db: State<Database>) -> Result<FullBackup, String> {
    db.export_full_backup().map_err(|e| e.to_string())
}

#[tauri::command]
fn restore_full_backup(
    db: State<Database>,
    backup: FullBackup,
) -> Result<serde_json::Value, String> {
    match db.restore_full_backup(backup) {
        Ok(_) => Ok(serde_json::json!({ "success": true })),
        Err(e) => Ok(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

// --- License Commands ---

#[tauri::command]
async fn activate_license(
    manager: State<'_, LicenseManager>,
    key: String,
) -> Result<serde_json::Value, String> {
    match manager.activate(key).await {
        Ok(msg) => Ok(serde_json::json!({ "success": true, "message": msg })),
        Err(msg) => Ok(serde_json::json!({ "success": false, "message": msg })),
    }
}

#[tauri::command]
async fn get_license_status(
    manager: State<'_, LicenseManager>,
) -> Result<license::LicenseData, String> {
    Ok(manager.get_status())
}

#[tauri::command]
async fn check_license(manager: State<'_, LicenseManager>) -> Result<bool, String> {
    Ok(manager.check_license().await)
}

#[tauri::command]
async fn retry_license_check(
    manager: State<'_, LicenseManager>,
) -> Result<serde_json::Value, String> {
    if manager.check_license().await {
        Ok(serde_json::json!({ "success": true }))
    } else {
        Ok(serde_json::json!({ "success": false, "message": "Validation failed" }))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            let db = Database::new(app.handle());
            db.init().expect("Failed to init DB");
            app.manage(db);

            let license_manager = LicenseManager::new(app.handle());
            // license_manager.check_license(); // Removed sync check to avoid async runtime issues during setup
            app.manage(license_manager);

            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.maximize();
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_products,
            get_products_count,
            get_product_by_sku,
            add_product,
            update_product,
            delete_product,
            create_transaction,
            get_dashboard_stats,
            get_transaction_history,
            get_transaction_by_id,
            get_vendor_profiles,
            add_vendor_profile,
            get_vendors,
            get_vendor_stats,
            add_vendor,
            update_vendor,
            delete_vendor,
            export_products,
            import_products,
            restore_products_backup,
            export_transactions,
            export_transaction_backup,
            restore_transaction_backup,
            clear_transaction_history,
            export_full_backup,
            restore_full_backup,
            activate_license,
            get_license_status,
            check_license,
            retry_license_check
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
