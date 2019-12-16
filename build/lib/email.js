"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
/**
 * 发送邮件
 * @param {any[]} data
 * @param {string} keywords
 */
exports.sendMail = (data, subject, text) => {
    const mailTransport = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS //授权码,通过QQ获取
        }
    });
    const options = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject,
        text,
    };
    return new Promise((resolve, reject) => {
        mailTransport.sendMail(options, function (err, msg) {
            if (err) {
                reject(err);
            }
            else {
                resolve(msg.response);
            }
        });
    });
};
