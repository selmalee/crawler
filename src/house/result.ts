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
    sendData = sendData.concat(data)
    timeout && clearTimeout(timeout)
    timeout = setTimeout(async () => {
      try {
        const res = await sendMail(sendData, keywords)
        console.error(`[${new Date().toLocaleString()}] ${res}`)
        sendData = []
      } catch(e) {
        console.error(`[${new Date().toLocaleString()}] send mail error: ${e.toString()}`)
      }
    }, CONFIG.SEND_TIME);
  } else {
    console.log(`[${new Date().toLocaleString()}] no data`)
  }
}
