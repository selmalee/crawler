import { sendMail } from '../lib/email';
import CONFIG from '../config'

let sendData = []
let timeout

/**
 * 展示爬取数据
 * @param {any[]} data
 */
export const showData = (data: any[], keywords: RegExp) => {
  if (data.length > 0) {
    console.log(`[${new Date().toLocaleString()}] ${data.length}条记录`)
    sendData = sendData.concat(data)
    timeout && clearTimeout(timeout)
    timeout = setTimeout(async () => {
      try {
        const subject = '【豆瓣租房】' + data.length + '条'
        const text = ' - ' + data.map(item => JSON.stringify(item)).join('\n - ') + '\n\n关键词：' + keywords.toString()
        const res = await sendMail(sendData, subject, text)
        console.log(`[${new Date().toLocaleString()}] send mail ${res}`)
        sendData = []
      } catch(e) {
        console.error(`[${new Date().toLocaleString()}] send mail error: ${e.toString()}`)
      }
    }, CONFIG.SEND_TIME);
  } else {
    console.log(`[${new Date().toLocaleString()}] no data`)
  }
}
