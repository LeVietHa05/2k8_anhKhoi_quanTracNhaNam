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
});

db.run(`DELETE FROM sensor_readings WHERE id NOT IN (
    SELECT id FROM sensor_readings ORDER BY timestamp DESC LIMIT 1000
)`);

module.exports = db;