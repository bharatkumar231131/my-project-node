import sgMail from '@sendgrid/mail';

import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        // apikey:'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'
    })
);

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.SGMAIL,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export default sendEmail;

