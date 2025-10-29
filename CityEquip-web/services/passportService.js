const passport = require('passport');
const User = require('../models/User');

function initPassport() {
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}

module.exports = { initPassport };