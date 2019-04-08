const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.templateIds = {
    userActivation: 'd-ae905b553a07475c9cf9b154c32022b0'
}

module.exports = sgMail;