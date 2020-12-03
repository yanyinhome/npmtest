/* clone：克隆数据，可深度克隆 */
export function clone(value, deep) {
    if (isPrimitive(value)) {
        return value
    }

    if (isArrayLike(value)) { //是类数组
        value = Array.prototype.slice.call(value)
        return value.map(item => deep ? clone(item, deep) : item)
    } else if (isPlainObject(value)) { //是对象
        let target = {}, key;
        for (key in value) {
            value.hasOwnProperty(key) && (target[key] = deep ? clone(value[key], deep) : value[key])
        }
    }

    let type = getRawType(value)

    switch (type) {
        case 'Date':
        case 'RegExp':
        case 'Error': value = new window[type](value); break;
    }
    return value
}
/* 识别各种浏览器及平台 */
export function BrowerInfo() {
    //运行环境是浏览器
    let inBrowser = typeof window !== 'undefined';
    //运行环境是微信
    let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
    let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
    //浏览器 UA 判断
    let UA = inBrowser && window.navigator.userAgent.toLowerCase();
    let isIE = UA && /msie|trident/.test(UA);
    let isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    let isEdge = UA && UA.indexOf('edge/') > 0;
    let isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
    let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
    let isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
    /*  */
}
/* 数组去重 */
export function unique(arr) {
    if (!isArrayLink(arr)) { //不是类数组对象
        return arr
    }
    let result = []
    let objarr = []
    let obj = Object.create(null)

    arr.forEach(item => {
        if (isStatic(item)) {//是除了symbol外的原始数据
            let key = item + '_' + getRawType(item);
            if (!obj[key]) {
                obj[key] = true
                result.push(item)
            }
        } else {//引用类型及symbol
            if (!objarr.includes(item)) {
                objarr.push(item)
                result.push(item)
            }
        }
    })

    return resulte
}
/* 格式化时间 */
export function dateFormater(formater, t) {
    let date = t ? new Date(t) : new Date(),
        Y = date.getFullYear() + '',
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    return formater.replace(/YYYY|yyyy/g, Y)
        .replace(/YY|yy/g, Y.substr(2, 2))
        .replace(/MM/g, (M < 10 ? '0' : '') + M)
        .replace(/DD/g, (D < 10 ? '0' : '') + D)
        .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
        .replace(/mm/g, (m < 10 ? '0' : '') + m)
        .replace(/ss/g, (s < 10 ? '0' : '') + s)
}
// dateFormater('YYYY-MM-DD HH:mm', t) ==> 2019-06-26 18:30
// dateFormater('YYYYMMDDHHmm', t) ==> 201906261830
/* 将指定字符串由一种时间格式转化为另一种 */
export function dateStrForma(str, from, to) {
    //'20190626' 'YYYYMMDD' 'YYYY年MM月DD日'
    str += ''
    let Y = ''
    if (~(Y = from.indexOf('YYYY'))) {
        Y = str.substr(Y, 4)
        to = to.replace(/YYYY|yyyy/g, Y)
    } else if (~(Y = from.indexOf('YY'))) {
        Y = str.substr(Y, 2)
        to = to.replace(/YY|yy/g, Y)
    }

    let k, i
    ['M', 'D', 'H', 'h', 'm', 's'].forEach(s => {
        i = from.indexOf(s + s)
        k = ~i ? str.substr(i, 2) : ''
        to = to.replace(s + s, k)
    })
    return to
}
// dateStrForma('20190626', 'YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('121220190626', '----YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('2019年06月26日', 'YYYY年MM月DD日', 'YYYYMMDD') ==> 20190626

// 一般的也可以使用正则来实现
//'2019年06月26日'.replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1-$2-$3') ==> 2019-06-26

/* 根据字符串路径获取对象属性 : 'obj[0].count' */
export function getPropByPath(obj, path, strict) {
    let tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1'); //将[0]转化为.0
    path = path.replace(/^\./, ''); //去除开头的.

    let keyArr = path.split('.'); //根据.切割
    let i = 0;
    for (let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        let key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        } else {
            if (strict) {//开启严格模式，没找到对应key值，抛出错误
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }
    return {
        o: tempObj, //原始数据
        k: keyArr[i], //key值
        v: tempObj ? tempObj[keyArr[i]] : null // key值对应的值
    };
};

/* 获取Url参数，返回一个对象 */
export function GetUrlParam() {
    let url = document.location.toString();
    let arrObj = url.split("?");
    let params = Object.create(null)
    if (arrObj.length > 1) {
        arrObj = arrObj[1].split("&");
        arrObj.forEach(item => {
            item = item.split("=");
            params[item[0]] = item[1]
        })
    }
    return params;
}
// ?a=1&b=2&c=3 ==> {a: "1", b: "2", c: "3"}

/* base64数据导出文件，文件下载 */
export function downloadFile(filename, data) {
    let DownloadLink = document.createElement('a');

    if (DownloadLink) {
        document.body.appendChild(DownloadLink);
        DownloadLink.style = 'display: none';
        DownloadLink.download = filename;
        DownloadLink.href = data;

        if (document.createEvent) {
            let DownloadEvt = document.createEvent('MouseEvents');

            DownloadEvt.initEvent('click', true, false);
            DownloadLink.dispatchEvent(DownloadEvt);
        }
        else if (document.createEventObject)
            DownloadLink.fireEvent('onclick');
        else if (typeof DownloadLink.onclick == 'function')
            DownloadLink.onclick();

        document.body.removeChild(DownloadLink);
    }
}

/* 求取数组中非NaN数据中的最大值 */
export function max(arr) {
    arr = arr.filter(item => !_isNaN(item))
    return arr.length ? Math.max.apply(null, arr) : undefined
}
//max([1, 2, '11', null, 'fdf', []]) ==> 11

/* 求取数组中非NaN数据中的最小值 */
export function min(arr) {
    arr = arr.filter(item => !_isNaN(item))
    return arr.length ? Math.min.apply(null, arr) : undefined
}
  //min([1, 2, '11', null, 'fdf', []]) ==> 1

  /* 返回一个lower - upper之间的随机数 */
  export function random(lower, upper){
    lower = +lower || 0
    upper = +upper || 0
    return Math.random() * (upper - lower) + lower;
  }
  //random(0, 0.5) ==> 0.3567039135734613
  //random(2, 1) ===> 1.6718418553475423
  //random(-2, -1) ==> -1.4474325452361945
  