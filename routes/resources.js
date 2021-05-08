const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('resources')
});

module.exports = router