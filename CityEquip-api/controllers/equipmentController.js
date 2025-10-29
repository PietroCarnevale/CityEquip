const equipmentService = require('../services/equipmentService');

// GET /equipments
exports.getEquipments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.type) filter.type = req.query.type;

        const { equipments, count, pages } = await equipmentService.getEquipments(filter, req.query.page, req.query.limit);
        res.json({ equipments, count, pages });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
};

// GET /equipments/:id
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await equipmentService.getEquipmentById(req.params.id);
        if (!equipment) return res.status(404).json({ message: "Not found" });
        res.json(equipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /equipments (protetto)
exports.createEquipment = async (req, res) => {
    try {
        const savedEquipment = await equipmentService.createEquipment(req.body);
        res.status(201).json(savedEquipment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /equipments/:id (protetto)
exports.updateEquipment = async (req, res) => {
    try {
        const { userId, ...updateData } = req.body;
        const updated = await equipmentService.updateEquipment(req.params.id, userId, updateData);
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /equipments/:id (protetto)
exports.deleteEquipment = async (req, res) => {
    try {
        const deleted = await equipmentService.deleteEquipment(req.params.id, req.body.user);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.searchEquipments = async (req, res) => {
    try {
        const equipments = await equipmentService.searchEquipments(req.query.q, req.query.limit);
        res.json(equipments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getTypesList = async (req, res) => {
    try {
        const types = await equipmentService.getTypesList();
        res.json(types);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getTopEquipments = async (req, res) => {
    try {
        const topEquipments = await equipmentService.getTopEquipments();
        res.json(topEquipments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
