const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('leaderboard')
});

router.get('/data', async(req, res) => {
    let users = await User.find().sort({ covicoins: -1 })
    let response = []
    users.forEach(user => {
        let object = {}
        object.username = user.username
        object.covicoins = user.covicoins
        object.streak = user.streak
        object.leads = user.verified_leads_count
        response.push(object)
    })
    res.json(response)
})

module.exports = router