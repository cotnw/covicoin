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

router.get('/resources', (req, res) => {
    res.render('resources')
});

router.get('/profile', (req, res) => {
    res.render('profile')
});

module.exports = router