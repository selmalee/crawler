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
let storageDataHash = {};
let storageData = [];
// 定期清理缓存数据
setInterval(() => {
    storageDataHash = {};
}, config_1.STORAGE_TIME);
/**
 * 展示爬取数据
 * @param {any[]} data
 */
exports.showData = (data, keywords) => __awaiter(void 0, void 0, void 0, function* () {
    // 筛选不在缓存中
    data = data.filter(item => !storageDataHash[item.text]);
    // 如果有数据
    if (data.length > 0) {
        console.log(`[${new Date().toLocaleString()}] ${data.length}条记录`);
        // 缓存数据
        data.forEach(item => {
            storageDataHash[item.text] = true;
        });
        storageData = storageData.concat(data);
        // 凌晨到7点别发邮件了
        if (new Date().getHours() < 7) {
            return;
        }
        // 发送邮件
        try {
            const subject = '【豆瓣租房】' + storageData.length + '条';
            const text = ' - ' + storageData.map(item => JSON.stringify(item)).join('\n - ') + '\n\n关键词：' + keywords.toString();
            const res = yield email_1.sendMail(storageData, subject, text);
            storageData = [];
            console.log(`[${new Date().toLocaleString()}] send mail ${res}`);
        }
        catch (e) {
            console.error(`[${new Date().toLocaleString()}] send mail error: ${e.toString()}`);
        }
    }
    else {
        console.log(`[${new Date().toLocaleString()}] no data`);
    }
});
