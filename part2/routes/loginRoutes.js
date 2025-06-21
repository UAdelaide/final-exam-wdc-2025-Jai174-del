const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check for user in the database
    const [users] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);
    if (!users.length || users[0].password_hash !== password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    // Store user info in session
    req.session.user = {
      id: users[0].user_id,
      username: users[0].username,
      role: users[0].role
    };
    // Return the role to the client
    res.json({ role: users[0].role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
