import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const db = new Database(join(__dirname, 'pharmacy.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDb = () => {
  // Create tables in a transaction
  db.transaction(() => {
    // Drop existing tables if they exist
    db.exec(`
      DROP TABLE IF EXISTS sales;
      DROP TABLE IF EXISTS medicines;
      DROP TABLE IF EXISTS employees;
    `);

    // Employees table
    db.exec(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Medicines table
    db.exec(`
      CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        expiryDate TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sales table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicineId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        totalPrice REAL NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medicineId) REFERENCES medicines(id)
      );
    `);

    // Insert default admin
    const hashedPassword = bcrypt.hashSync('admin', 10);
    db.prepare(`
      INSERT INTO employees (name, role, username, password)
      VALUES (?, ?, ?, ?)
    `).run('Administrator', 'admin', 'admin', hashedPassword);

    // Insert sample medicines
    const sampleMedicines = [
      ['Paracetamol', 'ABC Pharma', '2025-12-31', 500, 100],
      ['Amoxicillin', 'XYZ Labs', '2025-06-30', 1200, 50],
      ['Ibuprofen', 'Health Corp', '2025-09-30', 800, 75]
    ];

    const insertMedicine = db.prepare(`
      INSERT INTO medicines (name, manufacturer, expiryDate, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    sampleMedicines.forEach(medicine => {
      insertMedicine.run(...medicine);
    });
  })();
};

// Initialize the database
initDb();

export default db;