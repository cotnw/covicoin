const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('session')
});

router.get('/help', (req, res) => {
    res.render('help')
});

module.exports = router