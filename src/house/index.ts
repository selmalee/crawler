import { eachPageCrawler } from '../lib/crawler'
import { getFilterData } from './filter';
import { showData } from './result';
import { CRAWLER_TIME } from '../config'

const baseUrl = 'https://www.douban.com/group/';
const paramValues = ['106955/discussion?start=0', '106955/discussion?start=25', 'szsh/discussion?start=0', 'szsh/discussion?start=25', 'nanshanzufang/discussion?start=0', 'nanshanzufang/discussion?start=25', 'baoanzufang/discussion?start=0', 'baoanzufang/discussion?start=25'] // 与baseUrl拼接的参数，这里是爬取页数

const INTERVAL_TIME = paramValues && paramValues.length > 0 ? Math.floor(CRAWLER_TIME / paramValues.length) : 60000 // 分页请求的时间间隔

// const keywords = /一室|独卫/ // 关键词
const keywords = /(深大|桃园|大新|宝安中心|宝体|凯旋城|阳光粤海|翡翠明珠|君逸世家).*(两房|两室|2房|复式)/ // 关键词
const startTime = new Date().getTime() - CRAWLER_TIME // 开始时间

// 主函数
// 单次请求
const eachPageCrawl = (url) => {
  return async () => {
    const html: string | false = (await eachPageCrawler(url) as string | false)
    if (html) {
      const data = getFilterData(html, keywords, new Date(startTime))
      return data
    } else {
      return []
    }
  }
}
// 单次爬取
const crawler = async function () {
  let promises
  let index = 0
  let data = []
  // 处理分页等情况
  if (paramValues.length > 0) {
    promises = paramValues.map(val => eachPageCrawl(baseUrl + val))
  } else {
    promises = [eachPageCrawl(baseUrl)]
  }
  // 每隔一段时间请求一次，以防被封ip
  data = data.concat(await promises[index]())
  const inter = setInterval(async () => {
    index++
    // 爬取完毕，展示数据，发送邮件
    if (index === promises.length) {
      clearInterval(inter)
      showData(data, keywords)
      return
    }
    data = data.concat(await promises[index]())
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
}, CRAWLER_TIME)
