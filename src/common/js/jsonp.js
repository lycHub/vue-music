export default function myJsonp(url, data, cbName, callback) {
  // 回调函数
  // const cbFn = 'my_cb' + Math.random().toString().replace('.', '')
  window[cbName] = callback


  // 将对象参数转为字符串
  let queryString = url.indexOf('?') === -1 ? '?' : '&'
  for (let key in data) {
    queryString += key + '=' + data[key] + '&'
  }

  // 接上回调函数
  queryString += `callback=${cbName}`

  // 创建script
  const script = document.createElement('script')
  script.src = url + queryString
  document.body.appendChild(script)
}
