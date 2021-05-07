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
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;