const crypto = require('crypto');

const User = require('../models/User');
const mailService = require('./mailService');

exports.requestPasswordReset = async (email, baseURL) => {
    //1. see if a user with that email exists
    const user = await User.findOne({ email });
    if (!user) return;
    
    //2. set reset tokens and expiry on that account
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const ttl = 1; //expiration in hours
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + (ttl * 60 * 60 * 1000);
    await user.save();

    //3. send her an email with the token
    const resetURL =`${baseURL}/account/reset/${token}`;
    await mailService.send({
        user: user,
        subject: 'Password Reset',
        resetURL: resetURL
    });
};

exports.verifyResetToken = async (token) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: new Date() }
    });
    return user || null;
};

exports.consumeResetTokenAndSetPassword = async (token, newPassword) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) return null;

    await user.setPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return user;
};
