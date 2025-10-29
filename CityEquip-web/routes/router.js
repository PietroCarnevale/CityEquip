const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const expressValidator = require('../controllers/helpers/expressValidator');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../errors/errorHandlers')

router.get('/', equipmentController.homePage);

//EQUIPMENTS
router.get('/equipments/', equipmentController.getEquipments);
router.get('/equipments/page/:page', equipmentController.getEquipments);

router.get('/equipment/:id', equipmentController.getEquipmentById);

router.get('/add/', authController.isAdministrator, equipmentController.addEquipment);
router.post('/add/', authController.isAdministrator, equipmentController.createEquipment);

router.get('/equipments/:id/edit', authController.isAdministrator, equipmentController.editEquipment);
router.post('/add/:id', authController.isAdministrator, equipmentController.updateEquipment);

router.post('/equipments/:id/delete', authController.isAdministrator, equipmentController.deleteEquipment);

router.get('/equipments/search', equipmentController.searchEquipments);

router.get('/map', equipmentController.getEquipmentsMap);

router.get('/top', equipmentController.getTopEquipments);

//USERS
router.get('/register', userController.registerForm);
router.post('/register',
    expressValidator.registerValidators(),
    expressValidator.handleValidationErrors,
    userController.registerUser,
    authController.loginUser
);

router.get('/logout', authController.logout);

router.get('/login', authController.loginForm);
router.post('/login', authController.loginUser);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, userController.updateAccount);

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', authController.showResetForm);
router.post('/account/reset/:token',
    expressValidator.resetPasswordValidators(),
    expressValidator.handleValidationErrors,
    authController.updatePassword
);

//REVIEWS
router.get('/mytop', authController.isLoggedIn, reviewController.getUserTopEquipments);

router.get('/reviews', authController.isLoggedIn, reviewController.getReviewsByUser);

router.get('/reviews/edit/:id', authController.isLoggedIn, reviewController.editReview);
router.post('/reviews/edit/:id', authController.isLoggedIn, reviewController.updateReview);

router.post('/reviews/:id', authController.isLoggedIn, reviewController.createReview);


module.exports = router;