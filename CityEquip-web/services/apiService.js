const axios = require('axios');
require('dotenv').config({ path: 'variables.env' });

const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:7778",
    headers: { "x-api-key": process.env.API_KEY }
});

exports.getEquipments = async (type, page, limit) => {
    const { data } = await api.get('/equipments', { params: {type, page, limit} });
    return {
        equipments: data.equipments,
        count: data.count,
        pages: data.pages
    };
};

exports.getEquipmentById = async (id) => {
    const { data: equipment } = await api.get(`/equipments/${id}`);
    return equipment;
};

exports.createEquipment = async (data) => {
    const { data: saved } = await api.post('/equipments', data);
    return saved;
};

exports.updateEquipment = async (id, userId,  updateData) => {
    const { data: updatedEquipment} = await api.put(`/equipments/${id}`, { userId, ...updateData });
    return updatedEquipment;
};

exports.deleteEquipment = async (id, userId) => {
    const { data: deletedEquipment } = await api.delete(`/equipments/${id}`, { data: { user: userId } });
    return deletedEquipment;
};

exports.searchEquipments = async (q, limit) => {
    const { data: equipments } = await api.get('/equipments/search', { params: { q, limit } });
    return equipments;
};

exports.getTypesList = async () => {
    const { data: types } = await api.get('equipments/types');
    return types;
};

exports.getTopEquipments = async () => {
    const { data: topEquipments } = await api.get('/equipments/top');
    return topEquipments;
};
