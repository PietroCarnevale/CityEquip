const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

exports.getUserTopEquipments = async (userId) => {
    return Review.getUserTopEquipments(userId);
};

exports.getReviewsByUser = async (userId) => {
    return Review.getReviewsByUser(userId);
};

exports.createReview = async (reviewData) => {
    const review = new Review(reviewData);
    const savedReview = await review.save();
    return savedReview;
};

exports.getReviewById = async (reviewId) => {
    return Review.findById(reviewId).populate('equipment', 'name type');
}

exports.updateReview = async (id, userId, updateData) => {
    return Review.findOneAndUpdate({ _id: id, author: userId }, updateData, { 
        new: true ,
        runValidators: true
    }).populate('equipment', 'name').exec();
};

exports.getReviewCount = async () => {
    return Review.countDocuments();
};
