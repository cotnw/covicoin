const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lead = require('../models/Lead');

router.get('/', (req, res) => {
    res.render('profile')
});

router.get('/details', async(req, res) => {
    let response = {}
    let user = await User.findOne({ user_token: req.query.token })
    if (user) {
        response.username = user.username
        response.name = user.name
        response.covicoins = user.covicoins
        response.streak = user.streak
        response.daily_limit_left = user.tweets_limit.count
        let leads = await Lead.find({ user_token: req.query.token, verify1: true, verify2: true })
        if (leads) {
            response.leads_total = leads.length
            count = 0
            let today = new Date()
            leads.forEach((lead) => {
                if (lead.date.getDate() == today.getDate()) {
                    count++
                }
            })
            response.leads_total_today = count
        } else {
            response.leads_total = 0
            response.leads_total_today = 0
        }
        res.json(response)
    } else {
        res.sendStatus(404)
    }
})

module.exports = router