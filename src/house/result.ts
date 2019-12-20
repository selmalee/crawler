import { sendMail } from '../lib/email'
import { STORAGE_TIME } from '../config'

let storageData = {}
// 定期清理缓存数据
setInterval(() => {
  storageData = {}
}, STORAGE_TIME)

/**
 * 展示爬取数据
 * @param {any[]} data
 */
export const showData = async (data: any[], keywords: RegExp) => {
  // 筛选不在缓存中
  data = data.filter(item => !storageData[item.text])
  // 如果有数据
  if (data.length > 0) {
    console.log(`[${new Date().toLocaleString()}] ${data.length}条记录`)
    // 缓存数据
    data.forEach(item => {
      storageData[item.text] = true
    })
    // 凌晨到7点别发邮件了
    if (new Date().getHours() < 7) {
      return
    }
    // 防抖函数，延时发送邮件
    try {
      const subject = '【豆瓣租房】' + data.length + '条'
      const text = ' - ' + data.map(item => JSON.stringify(item)).join('\n - ') + '\n\n关键词：' + keywords.toString()
      const res = await sendMail(data, subject, text)
      console.log(`[${new Date().toLocaleString()}] send mail ${res}`)
    } catch(e) {
      console.error(`[${new Date().toLocaleString()}] send mail error: ${e.toString()}`)
    }
  } else {
    console.log(`[${new Date().toLocaleString()}] no data`)
  }
}
