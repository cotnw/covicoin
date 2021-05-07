const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    tweets: {
        type: Object,
        required: true
    },
    leads_confirmed: {
        type: Number,
        required: true
    },
    covicoins: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;