import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM employees WHERE username = ?').get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Employees endpoints
app.get('/api/employees', (req, res) => {
  try {
    const employees = db.prepare('SELECT id, name, role, username FROM employees').all();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', (req, res) => {
  const { name, role, username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO employees (name, role, username, password) VALUES (?, ?, ?, ?)'
    ).run(name, role, username, hashedPassword);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Medicines endpoints
app.get('/api/medicines', (req, res) => {
  try {
    const medicines = db.prepare('SELECT * FROM medicines').all();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/medicines', (req, res) => {
  const { name, manufacturer, expiryDate, price, quantity } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO medicines (name, manufacturer, expiryDate, price, quantity) VALUES (?, ?, ?, ?, ?)'
    ).run(name, manufacturer, expiryDate, price, quantity);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database initialized successfully');
});