const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const mailConfig = require('../config/mail');

let transporter;
function getTransporter() {
    if (!transporter) transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        auth: mailConfig.auth,
    });
    return transporter;
}

const generateHTML = (options = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/password-reset.pug`,
        options
    );
    return html;
};

exports.send = async (options) => {
    const html = generateHTML(options);
    const text = htmlToText(html);

    await getTransporter().sendMail({
        from: mailConfig.from,
        to: options.user.email,
        subject: options.subject,
        html,
        text,
    });
}