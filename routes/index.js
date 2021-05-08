const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/leaderboard', (req, res) => {
    res.render('leaderboard')
});

router.get('/city', (req, res) => {
    res.render('city')
})

module.exports = router