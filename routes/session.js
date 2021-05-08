const express = require('express');
const router = express.Router();
const getSessionTweets = require('../controllers/getSessionTweets')

router.get('/', (req, res) => {
    res.render('session')
});

router.get('/help', (req, res) => {
    res.render('help')
});

router.get('/start', async (req, res) => {
    const tweetsArray = await getSessionTweets('delhi', 20)
    res.send(tweetsArray)
});

module.exports = router