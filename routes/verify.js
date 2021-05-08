const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello world');
});

router.get('/2', (req, res) => {

})

module.exports = router