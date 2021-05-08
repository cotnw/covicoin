const { default: axios } = require('axios');
const express = require('express');
const urlencode = require('urlencode');
const router = express.Router();
const User = require('../models/User')
const LoginWithTwitter = require('login-with-twitter')
const Twitter = require('twitter');

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const tw = new LoginWithTwitter({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackUrl: `${process.env.BASE_URL}/twitter/callback`
})

let globalTokenSecret = ''

router.get('/', (req, res) => {
    tw.login((err, tokenSecret, url) => {
        if (err) {
            console.log(err)
        }
        globalTokenSecret = tokenSecret
        res.redirect(url)
    })
});

router.get('/callback', async(req, res) => {
    tw.callback({
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier
    }, globalTokenSecret, async(err, user) => {
        if (err) {
            console.log(err)
        }
        globalTokenSecret = ''
        let findUser = await User.findOne({ user_id: user.userId })
        if (!findUser) {
            await twitter.get('users/show', { user_id: user.userId }, (error, users, response) => {
                let newUser = new User({
                    username: user.userName,
                    user_id: user.userId,
                    user_token: user.userToken,
                    user_token_secret: user.userTokenSecret,
                    profile_image: users.profile_image_url_https.replace('_normal', ''),
                    name: users.name
                })
                newUser.save()
                res.render('city', { user_token: user.userToken })
            });
        }
        res.render('index', { user_token: user.userToken, logout: false })
    });
});

module.exports = router