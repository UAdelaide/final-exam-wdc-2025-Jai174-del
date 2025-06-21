const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/dogs - fetch all dogs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT d.dog_id, d.name, d.size, d.owner_id
      ,FROM ,Dogs, d
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs.' });
  }
});

module.exports = router;