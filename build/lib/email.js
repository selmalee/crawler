"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
/**
 * 发送邮件
 * @param {any[]} data
 * @param {string} keywords
 */
exports.sendMail = (data, keywords) => {
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
        subject: '豆瓣租房爬取结果',
        text: '关键词：' + keywords.toString() + '\n\n - ' + data.map(item => JSON.stringify(item)).join('\n - '),
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
