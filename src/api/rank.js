import jsonp from 'common/js/jsonp'

// 获取榜单列表
export function getRank(url, params, cbName) {
  return new Promise(resolve => {
    jsonp(url, params, cbName, function(res) {
      resolve(res.data.topList)
    })
  })
}


// 获取榜单详情
export function getRankDetail(url, params, cbName) {
  return new Promise(resolve => {
    jsonp(url, params, cbName, function(res) {
      resolve(res)
    })
  })
}
