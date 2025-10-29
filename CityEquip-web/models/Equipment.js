const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    schedule: {
        type: String,
        default: null,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    municipal: {
        type: String,
        enum: ["Yes", "No"],
        default: "No"
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    district: {
        type: String,
        default: null,
        trim: true
    },
    entity_code: {
        type: String,
        required: true,
        trim: true
    },
    entity_name: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
});

equipmentSchema.index({ name: 'text' });

equipmentSchema.statics.getTypesList = function() {
    return this.aggregate([
        { $match: { type: { $exists: true, $ne: "" } } },
        { $group: {_id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

equipmentSchema.statics.getTopEquipments = function () {
    return this.aggregate([
        {
            $lookup: {
                from: 'Review',
                localField: '_id',
                foreignField: 'equipment',
                as: 'reviews'
            }
        },
        {
            $match: { 'reviews.0': { $exists: true } }
        },
        {
            $addFields: { averageRating: { $avg: '$reviews.rating' } }
        },
        {
            $sort: { averageRating: -1 }
        },
        { $limit: 3 }
    ]);
};

equipmentSchema.set('toObject', { virtuals: true });
equipmentSchema.set('toJSON', { virtuals: true });

equipmentSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'equipment'
});

// ********PRE-FIND HOOKs******** --> populate virtual field REVIEWs
function autopopulate(next) {
    this.populate('reviews');
    next();
}

equipmentSchema.pre('find', autopopulate);
equipmentSchema.pre('findOne', autopopulate);
equipmentSchema.pre('findById', autopopulate);


module.exports = mongoose.model('Equipment', equipmentSchema, 'Equipment');
