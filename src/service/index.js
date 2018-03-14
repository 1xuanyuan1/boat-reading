/* eslint-disable no-undef */
var stream = weex.requireModule('stream')
// 追书神器内容前缀
// const contentURL = 'http://chapter2.zhuishushenqi.com/chapter/'
// 追书神器基本接口
var baseURL = 'http://api.book.dduke.me/'
// var baseURL = 'https://api.zhuishushenqi.com/'
/**
 * 将weex自带的stream 封装成符合 fetch规范的 异步操作
 * @param  {Object} [options={}] [description]
 * @return {[type]}              [description]
 */
const http = (options = {}) => {
  options = {
    ...options,
    headers: { // 增加一个请求头 (部分接口拦截了Android下的请求)
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
  }
  return new Promise((resolve, reject) => {
    stream.fetch(options, (res) => {
      // console.log(res)
      if (res.ok) {
        resolve(res.data)
      } else {
        reject(res)
      }
    })
  })
}
const getUrl = (url) => {
  if (url.indexOf('://') === -1) {
    url = baseURL + url
  }
  return url
}
export default {
  get (url, param = {}) {
    let query = []
    Object.keys(param).forEach((item) => {
      query.push(`${item}=${encodeURIComponent(param[item])}`)
    })
    let params = query.length > 0 ? '?' + query.join('&') : ''  // fixme
    // console.log(getUrl(url) + params)
    return http({
      method: 'GET',
      type: 'json',
      url: getUrl(url) + params
    })
  },
  post (url, param = {}) {
    return http({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'json',
      body: JSON.stringify(params),
      url: getUrl(url)
    })
  },
  postForm (url, param = {}) {
    return http({
      method: 'POST',
      type: 'json',
      body: JSON.stringify(params),
      url: getUrl(url)
    })
  }
}
