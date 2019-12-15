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
        await sendMail(sendData, keywords)
        sendData = []
      } catch(e) {

      }
    }, CONFIG.SEND_TIME);
  } else {
    console.log('no data')
  }
}
