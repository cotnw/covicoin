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
        if(lead) {
            const tweetID = session.tweets[session.current_tweet_index].tweet_id
            let user = await User.findOne({ user_token: req.query.token })
            if (user) { 
                console.log(tweetID)
                const userID = user.user_id
                const config = {
                    method: 'get',
                    url: `https://api.twitter.com/2/users/${userID}/tweets?expansions=referenced_tweets.id`,
                    headers: {
                        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
                    }
                };

                axios(config)
                .then(function (response) {
                    console.log(response.data.data[0])
                    res.send("hi")
                    // if(response.data.data[0].id == tweetID) {
                    //     if(response.data.data[0].text.includes('This is a ‘COVICoin’ generated reply!')) {
                    //         lead.verify1 = true
                    //     } else {
                    //         lead.verify1 = false
                    //     }
                    // } else {
                    //     lead.verify1 = false
                    // }
                    // lead.save()
                    // res.redirect(`verify/2?token=${req.query.token}`)
                })
                .catch(function (error) {
                    console.log(error);
                });
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
        // Search on Twitter and confirm if user has commented the generated reply or not and set verify1 accordingly
    } else {
        res.sendStatus(404)
    }
})

router.get('/2', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (session) {
        let lead = await Lead.findOne({ session_id: session._id, user_token: req.query.token })
        let bool1 = lead.proof_ocr_text.trim().includes(lead.contact_number1)
        let bool2 = lead.proof_ocr_text.trim().includes(lead.contact_number2)
        if(bool1 == true || bool2 == true) {
            lead.verify2 = true
        } else {
            lead.verify2 = false
        }
        const updatedLead = lead
        lead.save()
        console.log(updatedLead)
        res.send('process completed')
        // Search keywords in OCR Text and set verify2 to true in lead
    } else {
        res.sendStatus(404)
    }
})

module.exports = router