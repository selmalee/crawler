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
const crawler_1 = require("../lib/crawler");
const filter_1 = require("./filter");
const result_1 = require("./result");
const index_1 = require("../../config/index");
const baseUrl = 'https://www.douban.com/group/106955/discussion?start=';
const paramValues = [0, 25, 50]; // 与baseUrl拼接的参数，这里是爬取页数
const INTERVAL_TIME = paramValues && paramValues.length > 0 ? Math.round(index_1.EMAIL_TIME / paramValues.length) : 60000; // 分页请求的时间间隔
// const keywords = /一室|独卫/ // 关键词
const keywords = /(南山|桃园|大新|新安).*(两房|两室|2房)/; // 关键词
const startTime = new Date().getTime() - index_1.CRAWLER_TIME; // 开始时间
// 主函数
// 单次请求
const eachPageCrawl = (url) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        const html = yield crawler_1.eachPageCrawler(url);
        if (html) {
            const data = filter_1.getFilterData(html, keywords, new Date(startTime));
            result_1.showData(data, keywords);
        }
    });
};
// 单次爬取
const crawler = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let promises;
        let index = 0;
        // 处理分页等情况
        if (paramValues.length > 0) {
            promises = paramValues.map(val => eachPageCrawl(baseUrl + val));
        }
        else {
            promises = [eachPageCrawl(baseUrl)];
        }
        // 每隔一段时间请求一次，以防被封ip
        const inter = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield promises[index]();
            index++;
            if (index === promises.length) {
                clearInterval(inter);
            }
        }), INTERVAL_TIME);
    });
};
// 每隔一段时间爬取一次
crawler();
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield crawler();
    }
    catch (e) {
        console.log('crawler error: ' + e.toString());
    }
}), index_1.CRAWLER_TIME);
