import jsonp from 'common/js/jsonp'

// 获取热门歌曲
export function getHotSongs(url, params, cbName) {
  return new Promise(resolve => {
    jsonp(url, params, cbName, function(res) {
      resolve(res.data)
    })
  })
}

// 获取搜索列表
export function searchList(params, cbName) {
  const trueParams = {
    g_tk:272124877,
    uin:1120805364,
    format:'jsonp',
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    platform:'h5',
    needNewCode:1,
    zhidaqu:1,
    t:0,
    flag:1,
    ie:'utf-8',
    sem:1,
    aggr:0,
    remoteplace:'txt.mqq.all',
    _:1525352039875,
    jsonpCallback:cbName
  }
  Object.assign(trueParams, params)
  return new Promise(resolve => {
    jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', trueParams, cbName, function(res) {
      resolve(res.data)
    })
  })
}
