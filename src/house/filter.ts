import * as cheerio from 'cheerio'

/**
 * 对比时间时用到的时间格式化
 * @param {Date} date
 * @returns
 */
export const formatDate = (date: Date) => {
  // const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const HH = date.getHours()
  const MM = date.getMinutes()
  // const SS = date.getSeconds()
  return `${M > 9 ? '' : '0'}${M}-${D > 9 ? '' : '0'}${D} ${HH}:${MM}`
}

/**
 * 筛选爬取数据
 * @param {string} html
 * @returns
 */
export const getFilterData = (html: string, keywords: RegExp, startTime: Date) => {
  const $ = cheerio.load(html)
  const filterData = $('.article .title')
    // 筛选
    .filter((i: number, ele: any) => {
      // 关键词筛选
      const title = $(ele).find('a').text().trim()
      const isLimitKeywords = keywords.test(title)
      // 时间筛选
      const time = $(ele).nextAll('.time').html()
      const isLimitTime = time > formatDate(startTime) && time.indexOf('2018') === -1 // 特殊处理
      return isLimitTime && isLimitKeywords
    })
    // 提取信息
    .map((i: number, ele: any) => {
      const a = $(ele).find('a')
      const time = $(ele).nextAll('.time')
      return {
        href: a.attr('href'),
        text: a.text().trim(),
        time: time.html()
      }
    })
    .get()
  return filterData
}
