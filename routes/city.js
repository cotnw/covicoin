const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cities = require('../data/cities');

router.get('/', (req, res) => {
    res.render('city')
});

router.get('/add', async(req, res) => {
    let user = await User.findOne({ user_token: req.query.token })
    if (user) {
        if (!user.state) {
            if (cities[req.query.state].includes(req.query.city)) {
                user.state = req.query.state
                user.city = req.query.city
                user.save()
                res.redirect('/')
            } else {
                res.sendStatus(404)
            }
        }
    } else {
        res.sendStatus(404)
    }
});

module.exports = router