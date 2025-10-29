const Equipment = require('../models/Equipment')
const Review = require('../models/Review')
const User = require('../models/User')

// Trova tutti gli equipment, eventualmente filtrati
exports.getEquipments = async (filter = {}, page = 1, limit = 30) => {
    const skip = (page * limit) - limit;

    const equipmentsPromise = Equipment
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });

    const countPromise = Equipment.countDocuments(filter);

    const [equipments, count] = await Promise.all([equipmentsPromise, countPromise]);

    const pages = Math.ceil(count/limit);

    return { equipments, count, pages };
};

// Trova un equipment per ID
exports.getEquipmentById = async (id) => {
    return Equipment.findById(id);
};

// Crea un nuovo equipment
exports.createEquipment = async (data) => {
    const equipment = new Equipment(data);
    const savedEquipment = await equipment.save();
    return savedEquipment;
};

// Aggiorna un equipment esistente
exports.updateEquipment = async (id, userId, updateData) => {
    return Equipment.findOneAndUpdate({ _id: id, owner: userId }, updateData, { 
        new: true ,
        runValidators: true
    }).exec();
};

// Elimina un equipment
exports.deleteEquipment = async (id, userId) => {
    return Equipment.findOneAndDelete({ _id: id, owner: userId }).exec();
};

exports.searchEquipments = async (q, limit) => {
    if (!q || q.length < 2) return [];

    const regex = new RegExp(`\\b${q}`, "i");
    const regexResults = await Equipment.find({
        $or: [
            { name: regex }
        ],
    }).limit(limit);

    return regexResults;
};

exports.getTypesList = async () => {
    const list = await Equipment.getTypesList();
    const types = list.map(t => ({ type: t._id, count: t.count }));
    return types;
};

exports.getTopEquipments = async () => {
    const topEquipments = await Equipment.getTopEquipments();
    return topEquipments;
};
