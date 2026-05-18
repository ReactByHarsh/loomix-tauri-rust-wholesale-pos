use rusqlite::{params, Connection, Result, OptionalExtension};
// use std::path::Path;
use tauri::AppHandle;
use tauri::Manager;
use serde::{Serialize, Deserialize};

pub struct Database {
    path: String,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> Self {
        let app_dir = app_handle.path().app_data_dir().expect("failed to get app data dir");
        std::fs::create_dir_all(&app_dir).unwrap();
        let path = app_dir.join("loomix.db");
        
        Database {
            path: path.to_str().unwrap().to_string(),
        }
    }

    pub fn get_connection(&self) -> Result<Connection> {
        Connection::open(&self.path)
    }

    pub fn init(&self) -> Result<()> {
        let conn = self.get_connection()?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sku TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                wholesale_price REAL DEFAULT 0,
                stock INTEGER DEFAULT 0,
                category TEXT,
                image TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_amount REAL NOT NULL,
                payment_method TEXT NOT NULL,
                billing_mode TEXT DEFAULT 'retail',
                customer_name TEXT,
                customer_phone TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS transaction_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price_at_sale REAL NOT NULL,
                FOREIGN KEY(transaction_id) REFERENCES transactions(id),
                FOREIGN KEY(product_id) REFERENCES products(id)
            )",
            [],
        )?;

        // Vendors tables
        conn.execute(
            "CREATE TABLE IF NOT EXISTS vendors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vendor_id INTEGER,
                vendor_name TEXT,
                date TEXT NOT NULL,
                purchase_bill_image TEXT,
                purchase_amount REAL DEFAULT 0,
                payment_bill_image TEXT,
                payment_amount REAL DEFAULT 0,
                total_amount REAL DEFAULT 0,
                paid_amount REAL DEFAULT 0,
                pending_amount REAL DEFAULT 0,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS vendor_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                phone TEXT,
                address TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Migrations
        let _ = conn.execute("ALTER TABLE transactions ADD COLUMN customer_name TEXT", []);
        let _ = conn.execute("ALTER TABLE transactions ADD COLUMN customer_phone TEXT", []);
        let _ = conn.execute("ALTER TABLE transactions ADD COLUMN customer_dob TEXT", []);
        let _ = conn.execute("ALTER TABLE products ADD COLUMN cost_price REAL DEFAULT 0", []);
        let _ = conn.execute("ALTER TABLE products ADD COLUMN wholesale_price REAL DEFAULT 0", []);
        let _ = conn.execute("ALTER TABLE transactions ADD COLUMN extra_discount REAL DEFAULT 0", []);
        let _ = conn.execute("ALTER TABLE transactions ADD COLUMN billing_mode TEXT DEFAULT 'retail'", []);
        let _ = conn.execute("ALTER TABLE vendors ADD COLUMN vendor_id INTEGER", []);
        
        // Indices
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)", []);
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)", []);
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)", []);
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_vendors_date ON vendors(date)", []);
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_vendors_vendor_name ON vendors(vendor_name)", []);
        let _ = conn.execute("CREATE INDEX IF NOT EXISTS idx_vendors_vendor_id ON vendors(vendor_id)", []);

        // Seed
        let count: i64 = conn.query_row("SELECT count(*) FROM products", [], |row| row.get(0))?;
        if count == 0 {
            conn.execute(
                "INSERT INTO products (sku, name, price, stock, category) VALUES (?, ?, ?, ?, ?)",
                params!["123456", "Luxury Silk Shirt", 1200, 50, "Apparel"],
            )?;
            conn.execute(
                "INSERT INTO products (sku, name, price, stock, category) VALUES (?, ?, ?, ?, ?)",
                params!["654321", "Cotton Chino", 850, 40, "Apparel"],
            )?;
            conn.execute(
                "INSERT INTO products (sku, name, price, stock, category) VALUES (?, ?, ?, ?, ?)",
                params!["112233", "Leather Belt", 450, 100, "Accessories"],
            )?;
            conn.execute(
                "INSERT INTO products (sku, name, price, stock, category) VALUES (?, ?, ?, ?, ?)",
                params!["445566", "Designer Sunglasses", 2500, 15, "Accessories"],
            )?;
        }

        Ok(())
    }

    pub fn get_transaction_history(&self, page: i32, page_size: i32, search: String, payment_filter: String, date_filter: String) -> Result<TransactionHistoryResponse> {
        let conn = self.get_connection()?;
        let offset = (page - 1) * page_size;
        
        let mut base_sql = "FROM transactions WHERE 1=1".to_string();
        let mut query_params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if !search.is_empty() {
             base_sql.push_str(" AND (cast(id as text) LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)");
             let pattern = format!("%{}%", search);
             query_params.push(Box::new(pattern.clone()));
             query_params.push(Box::new(pattern.clone()));
             query_params.push(Box::new(pattern));
        }
        
        if payment_filter != "all" {
             base_sql.push_str(" AND payment_method = ?");
             query_params.push(Box::new(payment_filter));
        }

        if date_filter == "today" {
             base_sql.push_str(" AND date(created_at) = date('now', 'localtime')");
        } else if date_filter == "week" {
             base_sql.push_str(" AND created_at >= date('now', 'localtime', '-7 days')");
        } else if date_filter == "month" {
             base_sql.push_str(" AND created_at >= date('now', 'localtime', '-1 month')");
        }

        // Get total count
        let count_sql = format!("SELECT count(*) {}", base_sql);
        let mut count_stmt = conn.prepare(&count_sql)?;
        let total: i32 = count_stmt.query_row(rusqlite::params_from_iter(query_params.iter()), |row| row.get(0)).unwrap_or(0);

        // Get items
        let items_sql = format!("SELECT id, total_amount, extra_discount, payment_method, billing_mode, customer_name, customer_phone, customer_dob, created_at {} ORDER BY created_at DESC LIMIT ? OFFSET ?", base_sql);
        query_params.push(Box::new(page_size));
        query_params.push(Box::new(offset));

        let mut stmt = conn.prepare(&items_sql)?;
        let rows = stmt.query_map(rusqlite::params_from_iter(query_params.iter()), |row| {
             Ok(TransactionHistoryItem {
                 id: row.get(0)?,
                 total_amount: row.get(1)?,
                 extra_discount: row.get(2)?,
                 payment_method: row.get(3)?,
                 billing_mode: row.get(4).unwrap_or("retail".to_string()),
                 customer_name: row.get(5)?,
                 customer_phone: row.get(6)?,
                 customer_dob: row.get(7)?,
                 created_at: row.get(8)?,
             })
        })?;

        let mut transactions = Vec::new();
        for item in rows { transactions.push(item?); }
        
        Ok(TransactionHistoryResponse { transactions, total })
    }

    pub fn get_transaction_by_id(&self, id: i32) -> Result<Option<TransactionDetails>> {
        let conn = self.get_connection()?;
        let tx: Option<TransactionHistoryItem> = conn.query_row(
            "SELECT id, total_amount, extra_discount, payment_method, billing_mode, customer_name, customer_phone, customer_dob, created_at FROM transactions WHERE id = ?",
            [id],
            |row| Ok(TransactionHistoryItem {
                 id: row.get(0)?,
                 total_amount: row.get(1)?,
                 extra_discount: row.get(2)?,
                 payment_method: row.get(3)?,
                 billing_mode: row.get(4).unwrap_or("retail".to_string()),
                 customer_name: row.get(5)?,
                 customer_phone: row.get(6)?,
                 customer_dob: row.get(7)?,
                 created_at: row.get(8)?,
            })
        ).optional()?;

        if let Some(tx) = tx {
             let items = conn.prepare("SELECT ti.product_id, ti.quantity, ti.price_at_sale, p.name, p.sku FROM transaction_items ti JOIN products p ON ti.product_id = p.id WHERE ti.transaction_id = ?")?
                 .query_map([id], |row| {
                     Ok(TransactionItemDetail {
                         product_id: row.get(0)?,
                         quantity: row.get(1)?,
                         price_at_sale: row.get(2)?,
                         name: row.get(3)?,
                         sku: row.get(4)?,
                     })
                 })?
                 .collect::<Result<Vec<_>>>()?;
             
             Ok(Some(TransactionDetails {
                 meta: tx,
                 items
             }))
        } else {
             Ok(None)
        }
    }

    pub fn get_products(&self, page: i32, page_size: i32, search: String, category: String) -> Result<Vec<Product>> {
        let conn = self.get_connection()?;
        let offset = (page - 1) * page_size;
        
        let mut sql = "SELECT id, sku, name, price, wholesale_price, stock, category, created_at, cost_price FROM products WHERE 1=1".to_string();
        let mut query_params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if !search.is_empty() {
            sql.push_str(" AND (name LIKE ? OR sku LIKE ?)");
            let search_pattern = format!("%{}%", search);
            query_params.push(Box::new(search_pattern.clone()));
            query_params.push(Box::new(search_pattern));
        }
        if category != "all" {
            sql.push_str(" AND category = ?");
            query_params.push(Box::new(category));
        }
        
        sql.push_str(" ORDER BY created_at DESC LIMIT ? OFFSET ?");
        query_params.push(Box::new(page_size));
        query_params.push(Box::new(offset));
        
        let mut stmt = conn.prepare(&sql)?;
        
        let rows = stmt.query_map(rusqlite::params_from_iter(query_params.iter()), |row| {
             Ok(Product {
                id: row.get(0)?,
                sku: row.get(1)?,
                name: row.get(2)?,
                price: row.get(3)?,
                wholesale_price: row.get(4).unwrap_or(0.0),
                stock: row.get(5)?,
                category: row.get(6)?,
                created_at: row.get(7)?,
                cost_price: row.get(8).unwrap_or(0.0),
            })
        })?;

        let mut products = Vec::new();
        for product in rows {
            products.push(product?);
        }
        
        Ok(products)
    }

    pub fn get_products_count(&self, search: String, category: String) -> Result<i32> {
        let conn = self.get_connection()?;
        let mut sql = "SELECT count(*) FROM products WHERE 1=1".to_string();
        let mut query_params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if !search.is_empty() {
             sql.push_str(" AND (name LIKE ? OR sku LIKE ?)");
             let search_pattern = format!("%{}%", search);
             query_params.push(Box::new(search_pattern.clone()));
             query_params.push(Box::new(search_pattern));
        }
        if category != "all" {
             sql.push_str(" AND category = ?");
             query_params.push(Box::new(category));
        }
        
        let mut stmt = conn.prepare(&sql)?;
        
        let count: i32 = stmt.query_row(rusqlite::params_from_iter(query_params.iter()), |row| row.get(0))?;
        
        Ok(count)
    }

    pub fn get_product_by_sku(&self, sku: String) -> Result<Option<Product>> {
        let conn = self.get_connection()?;
        let mut stmt = conn.prepare("SELECT id, sku, name, price, wholesale_price, stock, category, created_at, cost_price FROM products WHERE sku = ?")?;
        
        stmt.query_row([sku], |row| {
            Ok(Product {
                id: row.get(0)?,
                sku: row.get(1)?,
                name: row.get(2)?,
                price: row.get(3)?,
                wholesale_price: row.get(4).unwrap_or(0.0),
                stock: row.get(5)?,
                category: row.get(6)?,
                created_at: row.get(7)?,
                cost_price: row.get(8).unwrap_or(0.0),
            })
        }).optional()
    }

    pub fn add_product(&self, product: Product) -> Result<i64> {
        println!("Adding product: {:?}", product);
        let conn = self.get_connection()?;
        let res = conn.execute(
            "INSERT INTO products (sku, name, price, wholesale_price, cost_price, stock, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
            params![
                product.sku,
                product.name,
                product.price,
                product.wholesale_price,
                product.cost_price,
                product.stock,
                product.category
            ],
        );
        match res {
            Ok(_) => {
                let id = conn.last_insert_rowid();
                println!("Product added with ID: {}", id);
                Ok(id)
            },
            Err(e) => {
                println!("Error adding product: {}", e);
                Err(e)
            }
        }
    }

    pub fn update_product(&self, product: Product) -> Result<()> {
        let conn = self.get_connection()?;
        conn.execute(
            "UPDATE products SET sku=?, name=?, price=?, wholesale_price=?, cost_price=?, stock=?, category=? WHERE id=?",
            params![
                product.sku,
                product.name,
                product.price,
                product.wholesale_price,
                product.cost_price,
                product.stock,
                product.category,
                product.id
            ],
        )?;
        Ok(())
    }

    pub fn delete_product(&self, id: i32) -> Result<()> {
        let conn = self.get_connection()?;
        conn.execute("DELETE FROM products WHERE id = ?", [id])?;
        Ok(())
    }

    // Transactions

     pub fn create_transaction(&self, data: TransactionData) -> Result<i64> {
        let mut conn = self.get_connection()?;
        let tx = conn.transaction()?;

        {
             tx.execute(
                "INSERT INTO transactions (total_amount, extra_discount, payment_method, billing_mode, customer_name, customer_phone, customer_dob) VALUES (?, ?, ?, ?, ?, ?, ?)",
                params![
                    data.total_amount,
                    data.extra_discount,
                    data.payment_method,
                    data.billing_mode,
                    data.customer_name,
                    data.customer_phone,
                    data.customer_dob
                ],
            )?;
            let transaction_id = tx.last_insert_rowid();

            let mut stmt_item = tx.prepare("INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_sale) VALUES (?, ?, ?, ?)")?;
            let mut stmt_stock = tx.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")?;

            for item in data.items {
                stmt_item.execute(params![transaction_id, item.product_id, item.quantity, item.price_at_sale])?;
                stmt_stock.execute(params![item.quantity, item.product_id])?;
            }
        } 

        tx.commit()?;
        
        let conn = self.get_connection()?;
        let id: i64 = conn.query_row("SELECT seq FROM sqlite_sequence WHERE name='transactions'", [], |row| row.get(0)).unwrap_or(0);
        
        Ok(id) 
    }

    pub fn get_dashboard_stats(&self) -> Result<DashboardStats> {
        let conn = self.get_connection()?;
        
        let today_sales: f64 = conn.query_row("SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE date(created_at) = date('now', 'localtime')", [], |r| r.get(0)).unwrap_or(0.0);
        let total_sales: f64 = conn.query_row("SELECT COALESCE(SUM(total_amount), 0) FROM transactions", [], |r| r.get(0)).unwrap_or(0.0);
        let total_transactions: i32 = conn.query_row("SELECT count(*) FROM transactions", [], |r| r.get(0)).unwrap_or(0);
        let low_stock_items: i32 = conn.query_row("SELECT count(*) FROM products WHERE stock < 10", [], |r| r.get(0)).unwrap_or(0);

        // Profit
        let total_gross_profit: f64 = conn.query_row("SELECT COALESCE(SUM((ti.price_at_sale - COALESCE(p.cost_price, 0)) * ti.quantity), 0) FROM transaction_items ti LEFT JOIN products p ON ti.product_id = p.id", [], |r| r.get(0)).unwrap_or(0.0);
        let total_discounts: f64 = conn.query_row("SELECT COALESCE(SUM(extra_discount), 0) FROM transactions", [], |r| r.get(0)).unwrap_or(0.0);
        let total_profit = total_gross_profit - total_discounts;

        let today_gross_profit: f64 = conn.query_row("SELECT COALESCE(SUM((ti.price_at_sale - COALESCE(p.cost_price, 0)) * ti.quantity), 0) FROM transaction_items ti LEFT JOIN products p ON ti.product_id = p.id JOIN transactions t ON ti.transaction_id = t.id WHERE date(t.created_at) = date('now', 'localtime')", [], |r| r.get(0)).unwrap_or(0.0);
        let today_discounts: f64 = conn.query_row("SELECT COALESCE(SUM(extra_discount), 0) FROM transactions WHERE date(created_at) = date('now', 'localtime')", [], |r| r.get(0)).unwrap_or(0.0);
        let today_profit = today_gross_profit - today_discounts;

        let chart_data: Vec<ChartData> = conn.prepare("SELECT date(created_at) as date, SUM(total_amount) as total FROM transactions GROUP BY date(created_at) ORDER BY date(created_at) DESC LIMIT 7")?
            .query_map([], |row| {
                Ok(ChartData {
                    date: row.get(0)?,
                    total: row.get(1)?,
                })
            })?
            .collect::<Result<_>>()?;

        Ok(DashboardStats {
            today_sales,
            total_sales,
            low_stock_items,
            total_transactions,
            today_profit,
            total_profit,
            chart_data
        })
    }

    pub fn get_vendor_profiles(&self) -> Result<Vec<VendorProfile>> {
        let conn = self.get_connection()?;
        let mut stmt = conn.prepare("SELECT id, name, phone, address FROM vendor_profiles ORDER BY name")?;
        let rows = stmt.query_map([], |row| {
             Ok(VendorProfile {
                 id: row.get(0)?,
                 name: row.get(1)?,
                 phone: row.get(2)?,
                 address: row.get(3)?,
             })
        })?;
        let mut profiles = Vec::new();
        for profile in rows { profiles.push(profile?); }
        Ok(profiles)
    }

    pub fn add_vendor_profile(&self, profile: VendorProfile) -> Result<i64> {
        let conn = self.get_connection()?;
        conn.execute(
            "INSERT INTO vendor_profiles (name, phone, address) VALUES (?, ?, ?)",
            params![profile.name, profile.phone, profile.address],
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn get_vendors(&self, page: i32, page_size: i32, search: String, date_filter: String, vendor_id: Option<i32>) -> Result<VendorListResponse> {
        let conn = self.get_connection()?;
        let offset = (page - 1) * page_size;
        
        let mut base_sql = "FROM vendors v LEFT JOIN vendor_profiles vp ON v.vendor_id = vp.id WHERE 1=1".to_string();
        let mut query_params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if !search.is_empty() {
             base_sql.push_str(" AND (v.vendor_name LIKE ? OR v.notes LIKE ?)");
             let pattern = format!("%{}%", search);
             query_params.push(Box::new(pattern.clone()));
             query_params.push(Box::new(pattern));
        }

        if let Some(vid) = vendor_id {
            base_sql.push_str(" AND v.vendor_id = ?");
            query_params.push(Box::new(vid));
        }

        if date_filter == "today" {
             base_sql.push_str(" AND date(v.date) = date('now', 'localtime')");
        } else if date_filter == "week" {
             base_sql.push_str(" AND v.date >= date('now', 'localtime', '-7 days')");
        } else if date_filter == "month" {
             base_sql.push_str(" AND v.date >= date('now', 'localtime', '-1 month')");
        }

        // Count
        let count_sql = format!("SELECT count(*) {}", base_sql);
        let mut count_stmt = conn.prepare(&count_sql)?;
        let total: i32 = count_stmt.query_row(rusqlite::params_from_iter(query_params.iter()), |row| row.get(0)).unwrap_or(0);

        // List - Explicitly select vendor_name from vendors table or fallback to profile
        let list_sql = format!("SELECT v.id, v.vendor_id, COALESCE(v.vendor_name, vp.name), v.date, v.purchase_bill_image, v.purchase_amount, v.payment_bill_image, v.payment_amount, v.total_amount, v.paid_amount, v.pending_amount, v.notes {} ORDER BY v.date DESC LIMIT ? OFFSET ?", base_sql);
        query_params.push(Box::new(page_size));
        query_params.push(Box::new(offset));

        let mut stmt = conn.prepare(&list_sql)?;
        let rows = stmt.query_map(rusqlite::params_from_iter(query_params.iter()), |row| {
             Ok(VendorRecord {
                 id: row.get(0)?,
                 vendor_id: row.get(1)?,
                 vendor_name: row.get(2)?,
                 date: row.get(3)?,
                 purchase_bill_image: row.get(4)?,
                 purchase_amount: row.get(5)?,
                 payment_bill_image: row.get(6)?,
                 payment_amount: row.get(7)?,
                 total_amount: row.get(8)?,
                 paid_amount: row.get(9)?,
                 pending_amount: row.get(10)?,
                 notes: row.get(11)?,
             })
        })?;

        let mut vendors = Vec::new();
        for v in rows { vendors.push(v?); }
        
        Ok(VendorListResponse { vendors, total })
    }

    pub fn get_vendor_stats(&self, vendor_id: Option<i32>) -> Result<VendorStats> {
        let conn = self.get_connection()?;
        let mut where_clause = "WHERE 1=1".to_string();
        let mut params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if let Some(vid) = vendor_id {
            where_clause.push_str(" AND vendor_id = ?");
            params.push(Box::new(vid));
        }

        let sql = format!("SELECT 
            COALESCE(SUM(purchase_amount), 0), 
            COALESCE(SUM(paid_amount), 0), 
            COALESCE(SUM(pending_amount), 0),
            COUNT(*)
            FROM vendors {}", where_clause);
        
        let stats = conn.query_row(&sql, rusqlite::params_from_iter(params.iter()), |row| {
            Ok(VendorStats {
                total_purchase: row.get(0)?,
                total_paid: row.get(1)?,
                total_pending: row.get(2)?,
                vendor_count: row.get(3)?,
            })
        }).unwrap_or(VendorStats { total_purchase: 0.0, total_paid: 0.0, total_pending: 0.0, vendor_count: 0 });

        Ok(stats)
    }

    pub fn add_vendor(&self, record: VendorRecord) -> Result<i64> {
        let conn = self.get_connection()?;
        conn.execute(
            "INSERT INTO vendors (vendor_id, vendor_name, date, purchase_bill_image, purchase_amount, payment_bill_image, payment_amount, total_amount, paid_amount, pending_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                record.vendor_id, record.vendor_name, record.date, record.purchase_bill_image, 
                record.purchase_amount, record.payment_bill_image, record.payment_amount, 
                record.total_amount, record.paid_amount, record.pending_amount, record.notes
            ],
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn update_vendor(&self, record: VendorRecord) -> Result<()> {
        let conn = self.get_connection()?;
        conn.execute(
            "UPDATE vendors SET vendor_id=?, vendor_name=?, date=?, purchase_bill_image=?, purchase_amount=?, payment_bill_image=?, payment_amount=?, total_amount=?, paid_amount=?, pending_amount=?, notes=? WHERE id=?",
            params![
                record.vendor_id, record.vendor_name, record.date, record.purchase_bill_image, 
                record.purchase_amount, record.payment_bill_image, record.payment_amount, 
                record.total_amount, record.paid_amount, record.pending_amount, record.notes, record.id
            ],
        )?;
        Ok(())
    }

    pub fn delete_vendor(&self, id: i32) -> Result<()> {
        let conn = self.get_connection()?;
        conn.execute("DELETE FROM vendors WHERE id = ?", [id])?;
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: Option<i32>,
    pub sku: String,
    pub name: String,
    pub price: f64,
    pub wholesale_price: f64,
    pub stock: i32,
    pub category: String,
    pub created_at: Option<String>,
    pub cost_price: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionData {
    pub total_amount: f64,
    pub extra_discount: f64,
    pub payment_method: String,
    pub billing_mode: String,
    pub customer_name: Option<String>,
    pub customer_phone: Option<String>,
    pub customer_dob: Option<String>,
    pub items: Vec<TransactionItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionItemInput {
    pub product_id: i32,
    pub quantity: i32,
    pub price_at_sale: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub today_sales: f64,
    pub total_sales: f64,
    pub low_stock_items: i32,
    pub total_transactions: i32,
    pub today_profit: f64,
    pub total_profit: f64,
    pub chart_data: Vec<ChartData>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChartData {
    pub date: String,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct TransactionHistoryItem {
    pub id: i32,
    pub total_amount: f64,
    pub extra_discount: f64,
    pub payment_method: String,
    pub billing_mode: String,
    pub customer_name: Option<String>,
    pub customer_phone: Option<String>,
    pub customer_dob: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct TransactionItemDetail {
    pub product_id: i32,
    pub quantity: i32,
    pub price_at_sale: f64,
    pub name: String,
    pub sku: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransactionDetails {
    #[serde(flatten)]
    pub meta: TransactionHistoryItem,
    pub items: Vec<TransactionItemDetail>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransactionHistoryResponse {
    pub transactions: Vec<TransactionHistoryItem>,
    pub total: i32,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct VendorProfile {
    pub id: Option<i32>,
    pub name: String,
    pub phone: String,
    pub address: String,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct VendorRecord {
    pub id: Option<i32>,
    pub vendor_id: Option<i32>,
    pub vendor_name: Option<String>,
    pub date: String,
    pub purchase_bill_image: Option<String>,
    pub purchase_amount: f64,
    pub payment_bill_image: Option<String>,
    pub payment_amount: f64,
    pub total_amount: f64,
    pub paid_amount: f64,
    pub pending_amount: f64,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct VendorStats {
    pub total_purchase: f64,
    pub total_paid: f64,
    pub total_pending: f64,
    pub vendor_count: i32,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct VendorListResponse {
    pub vendors: Vec<VendorRecord>,
    pub total: i32,
}
