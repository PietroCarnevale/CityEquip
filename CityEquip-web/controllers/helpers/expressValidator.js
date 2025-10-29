const { body, validationResult } = require('express-validator');

//middleware function factory
exports.registerValidators = () => [
    // Rules for express-validator
    body('name', 'A Name is required').notEmpty(),
    body('email', 'This Email is not valid')
        .isEmail()
        .customSanitizer(value => value.trim().toLowerCase()),
    body('password', 'Password cannot be blank').notEmpty(),

    // Custom Rules for express-validator
    body('password-confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match');
        }
        return true;
    })
];

//middleware function factory
exports.resetPasswordValidators = () => [
    body('password', 'Password cannot be blank').notEmpty(),
    body('password-confirm').custom((v, { req }) => {
        if (v !== req.body.password) throw new Error('Password confirmation does not match');
        return true;
    })
];

//middleware function
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array().map(err => err.msg);
    }
    next();
};
