const { addFlash } = require('./helpers/flash');
const api = require('../services/apiService');

exports.homePage = (req, res, next) => {
    res.redirect('/equipments');
};

exports.getEquipments = async (req, res, next) => {
    try {
        const type = req.query.type || '';
        const page = req.params.page || 1;
        const limit = 30;

        const [types, { equipments, count, pages }] = await Promise.all([
            api.getTypesList(),
            api.getEquipments(type, page, limit)
        ]);

        if (page > pages && count > 0) {
            addFlash(req, 'info', `You asked for page ${page}, which doesn't exist. Redirected to page ${pages}.`);
            return res.redirect(`/equipments/page/${pages}`);
        }

        res.render('equipments', { title: 'Equipments', equipments, types, selectedType: type, page, pages, count });
    } catch(err) {
        next(err);
    }
};

exports.getEquipmentById = async (req, res, next) => {
    try{
        const equipment = await api.getEquipmentById(req.params.id);

        if (!equipment) return next();

        res.render('equipment', {
            title: `Equipment ${equipment.name}`,
            equipment: equipment
        });
        
    } catch(err) {
        next(err);
    }
}

exports.addEquipment = (req, res) => {
    res.render('editEquipment', {title: 'Add Equipment'});
};

exports.createEquipment = async (req, res, next) => {
    try {
        const equipmentData = {
            name: req.body.name,
            schedule: req.body.schedule || null,
            type: req.body.type,
            municipal: req.body.municipal ? "Yes" : "No", 
            latitude: parseFloat(req.body.latitude) || null,
            longitude: parseFloat(req.body.longitude) || null,
            location: req.body.location,
            phone: req.body.phone || null,
            district: req.body.district || null,
            entity_code: req.body.entity_code,
            entity_name: req.body.entity_name,
            owner: req.user._id
        }

        const savedEquipment = await api.createEquipment(equipmentData);
        addFlash(req, 'success', 'Equipment created successfully.');
        res.redirect(`/equipment/${savedEquipment._id}`);
    } catch(err) {
        next(err);
    }
};

exports.editEquipment = async (req, res, next) => {
    try{
        const equipment = await api.getEquipmentById(req.params.id);

        if (!equipment) return next();

        if (!equipment.owner?.toString() === req.user._id.toString()) {
            addFlash(req, 'error', 'You are not the owner of this equipment.');
            return res.redirect(`/equipment/${equipment._id}`);
        }

        res.render('editEquipment', {
            title: `Edit ${equipment.name}`,
            equipment: equipment
        });
        
    } catch(err) {
        next(err);
    }
};

exports.updateEquipment = async (req, res, next) => {
    try {
        const updateData = {
            name: req.body.name,
            schedule: req.body.schedule || null,
            type: req.body.type,
            municipal: req.body.municipal ? "Yes" : "No", 
            latitude: parseFloat(req.body.latitude) || null,
            longitude: parseFloat(req.body.longitude) || null,
            location: req.body.location,
            phone: req.body.phone || null,
            district: req.body.district || null,
            entity_code: req.body.entity_code,
            entity_name: req.body.entity_name
        }

        const updatedEquipment = await api.updateEquipment(req.params.id, req.user._id, updateData);

        if (!updatedEquipment) {
            addFlash(req, 'error', 'Not authorized or equipment not found.');
            return res.redirect('/equipments');
        }

        addFlash(req, 'success', `Successfully updated <strong>${updatedEquipment.name}</strong>. <a href="/equipment/${updatedEquipment._id}">View equipment</a>`);

        res.redirect(`/equipments/${updatedEquipment._id}/edit`);
    } catch(err) {
        next(err);
    }
};

exports.deleteEquipment = async (req, res, next) => {
    try {
        const deletedEquipment = await api.deleteEquipment(req.params.id, req.user._id);
        
        if (!deletedEquipment) {
            addFlash(req, 'error', 'Not authorized or equipment not found.');
        } else {
            addFlash(req, 'success', `Succesfully deleted <strong>${deletedEquipment.name}</strong>.`);
        }

        res.redirect('/equipments');
    } catch(err) {
        next(err);
    }
};

exports.searchEquipments = async (req, res, next) => {
    try {
        const limit = 5;
        const equipments = await api.searchEquipments(req.query.q, limit);
        
        res.json({ equipments, length: equipments.length });
    } catch(err) {
        next(err);
    }
};

exports.getEquipmentsMap = async (req, res, next) => {
    try {
        const type = req.query.type || '';
        const [types, {equipments, count, pages}] = await Promise.all([
            api.getTypesList(),
            api.getEquipments(type, 1, Infinity)
        ]);
        res.render('equipmentsMap', { title: 'Map', equipments, types, selectedType: type || null});
    } catch(err) {
        next(err);
    }
};

exports.getTopEquipments = async (req, res, next) => {
    try {
        const topEquipments = await api.getTopEquipments();
        res.render('topEquipments', { topEquipments, title: 'Top Equipments' });
    } catch(err) {
        next(err);
    }
};
