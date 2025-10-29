const api = require('../services/apiService');
const reviewService = require('../services/reviewService');

exports.homePage = async (req, res, next) => {
    try {
        const [equipments, reviewsCount, types, topEquipments] = await Promise.all([
            api.getEquipments(null, 1, Infinity),
            reviewService.getReviewCount(),
            api.getTypesList(),
            api.getTopEquipments()
        ]);
        res.render('homePage', {
            title: 'CityEquip | Home',
            stats: {
                equipmentsCount: equipments.count,
                reviewsCount,
                typesCount: types.length
            },
            topEquipments
        });
    } catch (err) {
        next(err);
    }
};
