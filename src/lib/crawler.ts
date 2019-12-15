import * as http from 'http'
import * as https from 'https'

export const eachPageCrawler = (url: string) => {
  let requestFn
  const isHttps = /^https/.test(url)
  if (isHttps) {
    requestFn = https.request
  } else {
    requestFn = http.request
  }
  const urlOptions = new URL(url)
  const options = {
    hostname: urlOptions.hostname,
    port: urlOptions.port,
    path: urlOptions.pathname + urlOptions.search,
    method: 'GET',
    headers: {
      'Referer': 'https://www.douban.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    }
  }
  return new Promise((resolve,reject) => {
    const req = requestFn(options, (res) => {
      var html = '';
      if (res.statusCode !== 200) {
        res.resume() // 消费响应数据来释放内存。
        console.log('statusCode: ' + res.statusCode)
        resolve(html)
      }
      res.on('data', (chunk) => {
        html += chunk;
      });
      res.on('end', () => {
        resolve(html);
      });
    }).on('error', (e) => {
      reject(false);
      console.error(`eachPageCrawler error: ${e.toString()}\nurl: ${url}`)
    });
    req.end() // 使用 http.request() 时，必须始终调用 req.end() 来表示请求的结束，即使没有数据被写入请求主体。
  })
}
