const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    },
    equipment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Equipment',
        required: 'You must supply an equipment'
    },
    text: {
        type: String,
        required: 'Your review must have text'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: 'Your review must have a rating'
    }
});

reviewSchema.index({ author: 1, equipment: 1 }, { unique: true });

reviewSchema.statics.getReviewsByUser = function (userId) {
  return this.find({ author: userId })
    .populate('equipment', 'name type')
    .sort({ created: -1 });
};

reviewSchema.statics.getUserTopEquipments = function (userId) {
  return this.find({ author: userId })
    .populate('equipment', 'name type')
    .sort({ rating: -1 });
};

// ********PRE-FIND HOOKs******** --> populate field "author"
function autopopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);
reviewSchema.pre('findById', autopopulate);

module.exports = mongoose.model('Review', reviewSchema, 'Review');