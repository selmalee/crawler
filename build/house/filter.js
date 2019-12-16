"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
/**
 * 对比时间时用到的时间格式化
 * @param {Date} date
 * @returns
 */
exports.formatDate = (date) => {
    // const Y = date.getFullYear()
    const M = date.getMonth() + 1;
    const D = date.getDate();
    const HH = date.getHours();
    const MM = date.getMinutes();
    // const SS = date.getSeconds()
    return `${M > 9 ? '' : '0'}${M}-${D > 9 ? '' : '0'}${D} ${HH}:${MM}`;
};
/**
 * 筛选爬取数据
 * @param {string} html
 * @returns
 */
exports.getFilterData = (html, keywords, startTime) => {
    const $ = cheerio.load(html);
    const filterData = $('.article .title')
        // 筛选
        .filter((i, ele) => {
        // 关键词筛选
        const title = $(ele).find('a').text().trim();
        const isLimitKeywords = keywords.test(title);
        // 时间筛选
        const time = $(ele).nextAll('.time').html();
        const isLimitTime = time > exports.formatDate(startTime) && time.indexOf('2018') === -1; // 特殊处理
        return isLimitTime && isLimitKeywords;
    })
        // 提取信息
        .map((i, ele) => {
        const a = $(ele).find('a');
        const time = $(ele).nextAll('.time');
        return {
            text: a.text().trim(),
            href: a.attr('href'),
            time: time.html()
        };
    })
        .get();
    return filterData;
};
