const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/leaderboard', (req, res) => {
    res.render('leaderboard')
});

module.exports = router