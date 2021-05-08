const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_token: {
        type: String,
        required: true
    },
    user_token_secret: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    covicoins: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    tweets_limit: {
        type: Object,
        default: {
            count: 20,
            last_date: ''
        }
    },
    verified_leads_count: {
        type: Number,
        default: 0
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;