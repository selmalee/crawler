import * as nodemailer from 'nodemailer'

const SEND_TIMEOUT = 360000 * 0.5
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
    timeout = setTimeout(() => {
      sendMail(sendData, keywords)
    }, SEND_TIMEOUT);
  } else {
    // console.log('no data')
  }
}

/**
 * 发送邮件
 * @param {any[]} data
 * @param {string} keywords
 */
const sendMail = (data: any[], keywords: RegExp) => {
  const mailTransport = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS //授权码,通过QQ获取
    }
  })
  const options = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: '豆瓣租房爬取结果',
    text: '关键词：' + keywords.toString() + '\n\n - ' + data.map(item => JSON.stringify(item)).join('\n - '),
    // html: `<div>${data.join('\n')}</div>`,
  }
  mailTransport.sendMail(options, function(err, msg){
    if (err) {
      console.error('send mail error: ' + err.toString())
      console.log(data)
    } else {
      sendData = []
      console.log(msg.response)
    }
  })
}