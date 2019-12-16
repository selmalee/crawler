"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("../lib/email");
const config_1 = require("../config");
let sendData = [];
let timeout;
/**
 * 展示爬取数据
 * @param {any[]} data
 */
exports.showData = (data, keywords) => {
    if (data.length > 0) {
        sendData = sendData.concat(data);
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const subject = '【豆瓣租房】' + data[0].text;
                const text = ' - ' + data.map(item => JSON.stringify(item)).join('\n - ') + '\n\n关键词：' + keywords.toString();
                const res = yield email_1.sendMail(sendData, subject, text);
                console.error(`[${new Date().toLocaleString()}] ${res}`);
                sendData = [];
            }
            catch (e) {
                console.error(`[${new Date().toLocaleString()}] send mail error: ${e.toString()}`);
            }
        }), config_1.default.SEND_TIME);
    }
    else {
        console.log(`[${new Date().toLocaleString()}] no data`);
    }
};
