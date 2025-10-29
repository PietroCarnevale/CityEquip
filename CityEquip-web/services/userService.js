const User = require('../models/User');

exports.registerUser = async (name, role, email, password) => {
    const user = new User({ name, role, email });
    await User.register(user, password);
    return user;
};

exports.updateAccount = async (userId, updates) => {
    return User.findOneAndUpdate(
        { _id: userId },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );
};