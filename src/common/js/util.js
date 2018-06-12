export function shuffle(arr) {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
  }
  return _arr
}

// 取两个数之间的随机整数(包含边界)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
