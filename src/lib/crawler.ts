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
      'Cookie': 'bid="Kv3DWhbEo2U"; ll="118282"; __yadk_uid=5h4XFIxxczr033ujWKenAlDUPbD4PzTP; _vwo_uuid_v2=D707BBC525FD6480D3F5718D6AA932E00|f3e10cc7d988ab67e655950354116cc6; __gads=ID=af2d4c6c5648b5eb:T=1576253378:S=ALNI_MYj0f8tZBEjMX71FB8rhB1j6FxCpQ; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1576407522%2C%22https%3A%2F%2Fcn.bing.com%2F%22%5D; _pk_ses.100001.8cb4=*; ap_v=0,6.0; _pk_id.100001.8cb4=6aaff1797f93fdd6.1572781129.6.1576407532.1576395603.',
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
