const express = require('express');
const router = express.Router();
const getSessionTweets = require('../controllers/getSessionTweets')
const axios = require('axios')
const User = require('../models/User')
const Session = require('../models/Session')

router.get('/', async(req, res) => {
    let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (currentSession) {
        let tweet = currentSession.tweets[currentSession.current_tweet_index]
        axios.get(`https://publish.twitter.com/oembed?url=https://twitter.com/covicoin/status/${tweet.tweet_id}`).then(async(response) => {
            let tweets = currentSession.tweets
            tweets[currentSession.current_tweet_index].embed_html = response.data.html
            currentSession.tweets = tweets
            await Session.updateOne({ _id: currentSession.id }, { tweets: tweets })
            res.render('session', currentSession)
        })
    } else {
        res.redirect(`/start?token=${req.query.token}`)
    }
});

router.get('/skip', async(req, res) => {
    let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
    let user = await User.findOne({ user_token: req.query.token })
    if (currentSession) {
        currentSession.leads_skipped++
            currentSession.tweets[currentSession.current_tweet_index].skipped = true
        if (currentSession.current_tweet_index != 19) {
            currentSession.current_tweet_index++
                user.tweets_limit.count -= 1
        } else {
            currentSession.is_active = false
        }
        currentSession.save()
        res.redirect(`/session?token=${req.query.token}`)
    } else {
        res.redirect(`/start?token=${req.query.token}`)
    }
})

router.get('/help', async(req, res) => {
    let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (currentSession) {
        res.render('help', currentSession)
    } else {
        res.redirect(`/start?token=${req.query.token}`)
    }
});

router.get('/start', async(req, res) => {
    let user = await User.findOne({ user_token: req.query.token })
    if (user) {
        let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
        if (currentSession) {
            res.render('session', currentSession)
        } else {
            if (user.tweets_limit.count != 0) {
                const tweetsArray = await getSessionTweets(user.city, user.tweets_limit.count)
                let inactiveSessions = await Session.find({ user_token: req.query.token, is_active: false })
                let leads_confirmed = 0
                let leads_skipped = 0
                let today = new Date
                inactiveSessions.forEach(session => {
                    if (session.date.getDate() == today.getDate()) {
                        leads_confirmed += session.leads_confirmed
                        leads_skipped += session.leads_skipped
                    }
                })
                let session = new Session({
                    user_token: user.user_token,
                    tweets: tweetsArray,
                    date: new Date(),
                    leads_confirmed,
                    leads_skipped
                })
                session.save()
                let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
                if (currentSession) {
                    res.redirect(`/session?token=${req.query.token}`)
                }
            }
        }
    } else {
        res.sendStatus(404)
    }
});

router.get('/end', async(req, res) => {
    let currentSession = await Session.findOne({ user_token: req.query.token, is_active: true })
    let user = await User.findOne({ user_token: req.query.token })
    if (currentSession) {
        currentSession.is_active = false
        user.covicoins += currentSession.covicoins
        user.save()
        currentSession.save()
        res.render('index', { user_token: '', logout: false })
    } else {
        res.sendStatus(404)
    }
})

module.exports = router