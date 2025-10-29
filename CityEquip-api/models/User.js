const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const userSchema = new Schema({
    name: {
        type: String,
        required: 'Please provide a name',
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "administrator"],
        default: "user"
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please provide an email address'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema, 'User');