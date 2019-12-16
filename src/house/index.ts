import { eachPageCrawler } from '../lib/crawler'
import { getFilterData } from './filter';
import { showData } from './result';
import CONFIG from '../config'

const baseUrl = 'https://www.douban.com/group/106955/discussion?start=';
const paramValues = [0, 25, 50] // 与baseUrl拼接的参数，这里是爬取页数

const INTERVAL_TIME = paramValues && paramValues.length > 0 ? Math.round(CONFIG.SEND_TIME / paramValues.length) : 60000 // 分页请求的时间间隔

// const keywords = /一室|独卫/ // 关键词
const keywords = /(南山|桃园|大新|新安|宝体|宝安中心|阳光粤海|翡翠明珠).*(两房|两室|2房|复式)/ // 关键词
const startTime = new Date().getTime() - CONFIG.CRAWLER_TIME // 开始时间

// 主函数
// 单次请求
const eachPageCrawl = (url) => {
  return async () => {
    const html: string | false = (await eachPageCrawler(url) as string | false)
    if (html) {
      const data = getFilterData(html, keywords, new Date(startTime))
      showData(data, keywords)
    }
  }
}
// 单次爬取
const crawler = async function () {
  let promises
  let index = 0
  // 处理分页等情况
  if (paramValues.length > 0) {
    promises = paramValues.map(val => eachPageCrawl(baseUrl + val))
  } else {
    promises = [eachPageCrawl(baseUrl)]
  }
  // 每隔一段时间请求一次，以防被封ip
  await promises[index]()
  const inter = setInterval(async () => {
    index++
    if (index === promises.length) {
      clearInterval(inter)
      return
    }
    await promises[index]()
  }, INTERVAL_TIME)
}
// 每隔一段时间爬取一次
crawler()
setInterval(async () => {
  try {
    await crawler()
  } catch(e) {
    console.log('crawler error: ' + e.toString())
  }
}, CONFIG.CRAWLER_TIME)
