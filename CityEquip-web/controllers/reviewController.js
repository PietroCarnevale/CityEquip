const { addFlash } = require('./helpers/flash');
const reviewService = require('../services/reviewService');

exports.getUserTopEquipments = async (req, res, next) => {
    try {
        const topReviews = await reviewService.getUserTopEquipments(req.user._id);
        res.render('userTopEquipments', { topReviews, title: 'My Top' });
    } catch (err) {
        next(err);
    }
};

exports.getReviewsByUser = async (req, res, next) => {
    try {
        const reviews = await reviewService.getReviewsByUser(req.user._id);
        res.render('userReviews', { reviews, title: 'My Reviews' });
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const reviewData = {
            equipment: req.params._id,
            author: req.user._id,
            text: req.body.text,
            rating: req.body.rating
        };
        await reviewService.createReview(reviewData);

        addFlash(req, 'success', 'Equipment reviewed successfully');
        return res.redirect(`/equipment/${req.params.id}`);
    } catch (err) {
        if (err && err.code === 11000) {
            addFlash(req, 'error', 'You have already reviewed this equipment');
            return res.redirect(`/equipment/${req.params.id}`);
        }
        return next(err);
    }
};

exports.editReview = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        
        if (!review) return next();

        if (!review.author?.toString() === req.user._id.toString()) {
            addFlash(req, 'error', 'You are not the author of this review.');
            return res.redirect('/reviews');
        }

        res.render('editReview', {
            title: `Edit your review of ${review.equipment.name}`,
            review: review
        });
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const updateData = {
            text: req.body.text,
            rating: req.body.rating
        }

        const updatedReview = await reviewService.updateReview(req.params.id, req.user._id, updateData);

        if(!updatedReview) {
            addFlash(req, 'error', 'An error occurred while updating your review.');
        } else {
            addFlash(req, 'success', `Successfully updated your review of <strong>${updatedReview.equipment.name}</strong>`);
        }

        return res.redirect('/reviews');
    } catch (err) {
        next(err);
    }
};
