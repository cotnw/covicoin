const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello world');
});

router.post('/', (req, res) => {
    console.log(req.body)
    console.log("woah")
});

router.get('/2', (req, res) => {

})

module.exports = router