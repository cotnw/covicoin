const express = require('express');
const router = express.Router();
const getSessionTweets = require('../controllers/getSessionTweets')
const User = require('../models/User')
const Session = require('../models/Session')

router.get('/', (req, res) => {
    res.render('session')
});

router.get('/help', (req, res) => {
    res.render('help')
});

router.get('/start', async(req, res) => {
    let user = await User.findOne({ user_token: req.query.token })
    if (user) {
        const tweetsArray = await getSessionTweets(user.city, 20)
        let session = new Session({
            user_token: user.user_token,
            tweets: tweetsArray,
            date: new Date()
        })
        session.save()
    } else {
        res.sendStatus(404)
    }
});

module.exports = router