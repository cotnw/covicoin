const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const twitterRouter = require('./routes/twitter');
const sessionRouter = require('./routes/session');
const cityRouter = require('./routes/city');
const profileRouter = require('./routes/profile');
const leaderboardRouter = require('./routes/leaderboard');
const resourcesRouter = require('./routes/resources');
const logoutRouter = require('./routes/logout');
const verifyRouter = require('./routes/verify');

const db = process.env.MONGODB_URL;

const app = express();

const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => {
    console.log(`API listening on ${port}!`);
    if (err) throw err;
});

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/twitter', twitterRouter);
app.use('/session', sessionRouter);
app.use('/city', cityRouter);
app.use('/profile', profileRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/resources', resourcesRouter);
app.use('/logout', logoutRouter);
app.use('/verify', verifyRouter);

module.exports = app;