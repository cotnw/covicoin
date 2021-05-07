const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/session', (req, res) => {
    res.render('session')
});

module.exports = router