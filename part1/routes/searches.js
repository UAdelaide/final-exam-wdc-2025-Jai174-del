// routes/searches.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET /api/dogs
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs.' });
  }
});

// GET /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location,
             u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch open walk requests.' });
  }
});

// GET /api/walkers/summary
router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT
        u.username AS walker_username,
        COUNT(r.rating_id) AS total_ratings,
        ROUND(AVG(r.rating), 1) AS average_rating,
        (
          SELECT COUNT(*)
          FROM WalkRequests wr
          JOIN WalkRatings rr ON wr.request_id = rr.request_id
          WHERE rr.walker_id = u.user_id AND wr.status = 'completed'
        ) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walker summaries.' });
  }
});

module.exports = router;
