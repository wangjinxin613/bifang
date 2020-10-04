
export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s: string) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

// formItem或者类formItem的集合赋值value
export function setValue(options: Array<any>, obj: any) {
  options = deepCopy(options);
  for(let i in options) {
    if(options[i].name && typeof obj[options[i].name!] != 'undefined') {
      options[i].value = obj[options[i].name!];
    }
  }
  return options;
}

// 对象的深拷贝
export function deepCopy(obj: any) {
  var result : any = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}