const { addFlash } = require('./helpers/flash');
const userService = require('../services/userService');

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register'});
};

exports.registerUser = async (req, res, next) => {
    try {
        if (req.validationErrors?.length) {
            req.validationErrors.forEach(msg => addFlash(req, 'error', msg));
            return res.render('register', {
                title: 'Register',
                body: req.body,
                flashes: req.session.flashes
            });
        }
        await userService.registerUser(req.body.name, req.body.role, req.body.email, req.body.password);
        next();
    } catch (err) {
        next(err);
    }
};

exports.account = (req, res) => {
    res.render('account', { title: 'Edit your account' });
};

exports.updateAccount = async (req, res, next) => {
    try {
        const updates = {
            name: req.body.name,
            email: req.body.email
        };
        await userService.updateAccount(req.user._id, updates);
        addFlash(req, 'success', 'Profile updated successfully');
        //Going Back -> Use the referer header or fallback to /account
        const redirectTo = req.get('Referer') || '/account';
        res.redirect(redirectTo);
    } catch (err) {
        next(err);
    }
};