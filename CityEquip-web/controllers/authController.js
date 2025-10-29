const passport = require('passport');
const { addFlash } = require('./helpers/flash');
const passwordResetService = require('../services/passwordResetService');

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        
        // failed auth
        if (!user) {
            addFlash(req, 'error', info?.message || 'Failed login');
            return res.redirect('/login');
        }

        // success: establish session
        req.login(user, (err) => {
            if (err) return next(err);
            addFlash(req, 'success', 'You are now logged in');
            return res.redirect('/equipments');
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            next(err);
            return;
        }
        addFlash(req, 'success', 'You are now logged out');
        res.redirect('/equipments');
    });
};

exports.loginForm = (req, res, next) => {
    res.render('login', { title: 'Login' });
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    addFlash(req, 'error', 'You must be logged in to do that');
    res.redirect('/login');
};

exports.isAdministrator = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'administrator') {
        next();
        return;
    }
    addFlash(req, 'error', 'You must be an administrator to do that');
    if (req.isAuthenticated()) {
        res.redirect('/equipments');
    } else {
        res.redirect('/login');
    }
};

exports.forgot = async (req, res, next) => {
    try {
        await passwordResetService.requestPasswordReset(req.body.email, req.headers.host);
        addFlash(req, 'success', 'Check your email for the reset link');
        return res.redirect('/login');
    } catch (err) {
        return next(err);
    }
};

exports.showResetForm = async (req, res, next) => {
    try {
        const user = await passwordResetService.verifyResetToken(req.params.token);
        if (!user) {
            addFlash(req, 'error', 'Password reset is invalid or has expired');
            return res.redirect('/login');
        }
        // Pass the raw token to the form so the POST can use it
        return res.render('reset', { title: 'Reset your password', token: req.params.token });
    } catch (err) {
        return next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        // handle validator errors from previous middleware
        if (req.validationErrors?.length) {
            req.validationErrors.forEach(msg => addFlash(req, 'error', msg));
            return res.redirect(req.get('Referer'));
        }

        const user = await passwordResetService.consumeResetTokenAndSetPassword(req.params.token, req.body.password);
        if (!user) {
            addFlash(req, 'error', 'Password reset is invalid or has expired');
            return res.redirect('/login');
        }

        await new Promise((resolve, reject) =>
            req.login(user, err => err ? reject(err) : resolve())
        );
        await new Promise(resolve => req.session.save(resolve));

        addFlash(req, 'success', 'Your password has been reset. You are now logged in');
        return res.redirect('/equipments');
    } catch (err) {
        return next(err);
    }
};
