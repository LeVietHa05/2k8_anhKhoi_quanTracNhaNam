const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sensor_data.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create sensor data table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        temp1 REAL,
        humid1 REAL,
        temp2 REAL,
        humid2 REAL,
        co2 REAL,
        pm25 REAL,
        pm10 REAL
    )`);

    // Create LED states table
    db.run(`CREATE TABLE IF NOT EXISTS led_states (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        state INTEGER DEFAULT 0  -- 0 for OFF, 1 for ON
    )`);

    // Insert initial LED states (example with 3 LEDs)
    db.run(`INSERT OR IGNORE INTO led_states (id, name, state) VALUES
        (1, 'LED1', 0),
        (2, 'LED2', 0),
        (3, 'LED3', 0)`);
});

module.exports = db;