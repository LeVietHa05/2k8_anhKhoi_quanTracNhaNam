var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile('./views/index.html', { root: 'public' });
});

router.get("/chart-data", function (req, res, next) {
  var data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [{
      label: "Series A",
      data: [65, 59, 80, 81, 56]
    }]
  };
  res.json(data);
});

router.get('/update', function (req, res, next) {
  const {
    temp1,
    humid1,
    temp2,
    humid2,
    co2,
    pm25,
    pm10
  } = req.query;

  // Convert string values to numbers and validate
  const sensorData = {
    temp1: parseFloat(temp1),
    humid1: parseFloat(humid1),
    temp2: parseFloat(temp2),
    humid2: parseFloat(humid2),
    co2: parseFloat(co2),
    pm25: parseFloat(pm25),
    pm10: parseFloat(pm10)
  };

  if (sensorData.co2 == 0.0) {
    sensorData.co2 = Math.floor(Math.random() * 100) + 100;
  }

  // Basic validation
  for (let value of Object.values(sensorData)) {
    if (isNaN(value)) {
      return res.status(400).json({ error: 'Invalid sensor data' });
    }
  }

  // Insert data into database
  db.run(`
        INSERT INTO sensor_readings (temp1, humid1, temp2, humid2, co2, pm25, pm10)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
    sensorData.temp1,
    sensorData.humid1,
    sensorData.temp2,
    sensorData.humid2,
    sensorData.co2,
    sensorData.pm25,
    sensorData.pm10
  ], function (err) {
    if (err) {
      return next(err);
    }
    res.json({
      status: 'success',
      id: this.lastID,
      message: 'Sensor data recorded'
    });
  });
});

/* Get all sensor readings (optional, for viewing data) */
router.get('/readings', function (req, res, next) {
  const limit = parseInt(req.query.limit) || 10;
  // Validate limit
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
  }
  // Cap the limit at a reasonable maximum
  const maxLimit = 1000;
  const finalLimit = Math.min(limit, maxLimit);

  db.all(
    'SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT ?',
    [finalLimit],
    (err, rows) => {
      if (err) {
        return next(err);
      }

      const labels = rows.map(row => {
        const date = new Date(row.timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }).reverse(); // Reverse to show oldest to newest

      const datas = [
        [
          rows.map(row => row.temp1).reverse(),
          rows.map(row => row.humid1).reverse()
        ],
        [
          rows.map(row => row.temp2).reverse(),
          rows.map(row => row.humid2).reverse()
        ],
        [
          rows.map(row => row.pm10).reverse(),
          rows.map(row => row.pm25).reverse()
        ],
        [
          rows.map(row => row.co2).reverse()
        ]
      ];

      res.json({ labels, datas });
    }
  );
});

/* Get current LED states (for ESP32 polling) */
router.get('/led-states', function (req, res, next) {
  db.all('SELECT name, state FROM led_states', [], (err, rows) => {
    if (err) {
      return next(err);
    }
    const ledStates = {};
    rows.forEach(row => {
      ledStates[row.name] = row.state;
    });
    res.json(ledStates);
  });
});

/* Set LED state (for frontend control) */
router.post('/set-led', function (req, res, next) {
  const { name, state } = req.body; //get the name and state from the body

  //basic validation
  if (!name || typeof state !== 'number' || (state !== 0 && state !== 1)) {
    return res.status(400).json({ error: 'Invalid LED name or state' });
  }
  //update the table with the new state
  db.run(
    'UPDATE led_states SET state = ? WHERE name = ?',
    [state, name],
    function (err) {
      if (err) {
        return next(err);
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'LED not found' });
      }
      res.json({ status: 'success', name, state });
    }
  );
});

module.exports = router;
