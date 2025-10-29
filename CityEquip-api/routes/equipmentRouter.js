const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { verifyAppAuth } = require('../controllers/authController');

router.get("/", equipmentController.getEquipments);
router.get("/search", equipmentController.searchEquipments);
router.get("/types", equipmentController.getTypesList);
router.get("/top", equipmentController.getTopEquipments);
router.get("/:id", equipmentController.getEquipmentById);
router.post("/", verifyAppAuth, equipmentController.createEquipment);
router.put("/:id", verifyAppAuth, equipmentController.updateEquipment);
router.delete("/:id", verifyAppAuth, equipmentController.deleteEquipment);

module.exports = router;