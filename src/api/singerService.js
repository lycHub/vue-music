import jsonp from 'common/js/jsonp'

// 获取歌手列表
function getSingers(url, params, cbName) {
  return new Promise(resolve => {
    jsonp(url, params, cbName, function(res) {
      resolve(res.data.list)
    })
  })
}


// 获取歌手数据
function getSinger(url, params, cbName) {
 // params = Object.assign(params, {singermid: mid})
  return new Promise(resolve => {
    jsonp(url, params, cbName, function(res) {
      resolve(res.data.list)
    })
  })
}


export {getSingers, getSinger}
