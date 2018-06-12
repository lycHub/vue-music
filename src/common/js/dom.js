//添加一个class，如果不存在的话
export function addClass(element, className) {
  if (!hasClass(element, className)) element.className += " " +className
}

//删除一个class，如果存在的话
function removeClass (element, className) {
  if (hasClass(element, className)) {
    element.className = element.className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
  }
}


//判断是否存在某个class
function hasClass(element, className) {
  return new RegExp('(\\s|^)'+className+'(\\s|$)').test(element.className);
}


// 浏览器性能检测
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]]) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (!vendor) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
