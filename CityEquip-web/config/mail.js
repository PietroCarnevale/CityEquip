module.exports = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    from: process.env.MAIL_FROM || 'CityEquip <no-reply@cityequip.com>'
};