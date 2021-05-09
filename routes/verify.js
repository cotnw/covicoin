const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Session = require('../models/Session');
const Lead = require('../models/Lead');
const axios = require('axios')
require('dotenv').config()

router.get('/', (req, res) => {
    res.send('hello world');
});

router.post('/', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    req.body.formData = JSON.parse(req.body.formData)
    if (session) {
        let searchLead = await Lead.findOne({ session_id: session._id, is_active: true })
        if (searchLead) {
            res.sendStatus(404)
        } else {
            let lead = new Lead({
                session_id: session._id,
                user_token: req.query.token,
                address1: req.body.formData.address1,
                address2: req.body.formData.address2,
                item: req.body.formData.item,
                quantity: req.body.formData.quantity,
                contact_name: req.body.formData.contactName,
                contact_number1: req.body.formData.contactNumber1,
                contact_number2: req.body.formData.contactNumber2,
                additional_info: req.body.formData.addl_info,
                date: new Date(),
                proof_ocr_text: req.body.ocrText,
                generated_reply: req.body.generatedReply
            })
            lead.save()
            res.redirect(`verify/1?token=${req.query.token}`)
        }
    } else {
        res.sendStatus(404)
    }
    console.log(req.body)
});

router.get('/1', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (session) {
        let lead = await Lead.findOne({ session_id: session._id, user_token: req.query.token })
        if (lead) {
            let tweetID = session.tweets[session.current_tweet_index].tweet_id
            let user = await User.findOne({ user_token: req.query.token })
            if (user) {
                console.log(tweetID)
                const userID = user.user_id
                let config = {
                    method: 'get',
                    url: `https://api.twitter.com/2/users/${userID}/tweets?expansions=referenced_tweets.id`,
                    headers: {
                        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
                    }
                };
                axios(config)
                    .then(function(userTweets) {
                        let config = {
                            method: 'get',
                            url: `https://api.twitter.com/2/tweets/${tweetID}?expansions=referenced_tweets.id,entities.mentions.username,author_id&tweet.fields=text`,
                            headers: {
                                'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
                            }
                        };
                        axios(config).then(tweet => {
                            console.log(tweet.data.data)
                            console.log(tweet.data.data.referenced_tweets[0])
                            if (tweet.data.data.referenced_tweets[0].type == 'retweeted') {
                                tweetID = tweet.data.data.referenced_tweets[0].id
                                if (userTweets.data.data[0].referenced_tweets[0].id == tweetID) {
                                    if (userTweets.data.data[0].text.includes('This is a ‘COVICoin’ generated reply!')) {
                                        lead.verify1 = true
                                    } else {
                                        lead.verify1 = false
                                    }
                                } else {
                                    lead.verify1 = false
                                }
                                lead.save()
                                res.redirect(`${process.env.BASE_URL}/verify/2?token=${req.query.token}`)
                            }
                        })
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
})

router.get('/2', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    let user = await User.findOne({ user_token: req.query.token })
    if (session) {
        let lead = await Lead.findOne({ session_id: session._id, user_token: req.query.token })
        let bool1 = lead.proof_ocr_text.trim().includes(lead.contact_number1)
        let bool2 = lead.proof_ocr_text.trim().includes(lead.contact_number2)
        if (bool1 == true || bool2 == true) {
            lead.verify2 = true
            lead.is_active = false
            session.leads_confirmed++;
            session.covicoins++;
        } else {
            lead.verify2 = false
        }
        const updatedLead = lead
        session.current_tweet_index++;
        user.tweets_limit.count = user.tweets_limit.count - 1
        user.tweets_limit.last_date = new Date()
        await User.updateOne({ _id: user.id }, { tweets_limit: user.tweets_limit })
        session.save()
        lead.save()
        console.log(updatedLead)
        res.redirect(`${process.env.BASE_URL}/session?token=${req.query.token}`)
    } else {
        res.sendStatus(404)
    }
})

module.exports = router