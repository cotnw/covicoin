const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user_token: '', logout: false })
});

module.exports = router