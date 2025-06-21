const express = require('express');
const path = require('path');
const router = express.Router();

// Owner dashboard
router.get('/owner-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/owner-dashboard.html'));
});

// Walker dashboard
router.get('/walker-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'walker') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/walker-dashboard.html'));
});

module.exports = router;
