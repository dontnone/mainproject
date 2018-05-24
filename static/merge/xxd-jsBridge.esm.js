function createElement(name) {
  var element = document.createElement(name);
  element.style.cssText = 'display:none;width:0px;height:0px';
  return element;
}

function stringify(obj) {
  return obj ? Object.keys(obj).sort().map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encodeURIComponent(key);
    }

    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : '';
}

function isAndroid() {
  return navigator.userAgent.match(/Android/i) ? true : false;
}
function isMobileQQ() {
  var ua = navigator.userAgent;
  return (/(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d.]+)/.test(ua) || /\bV1_AND_SQI?_([\d.]+)(.*? QQ\/([\d.]+))?/.test(ua)
  );
}
function isiOS() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
}
function isWeChat() {
  return navigator.userAgent.match(/micromessenger/i) ? true : false;
}

function isAndroidChrome() {
  return (navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/)) && isAndroid() && !isMobileQQ();
}

function openByIframe(url, callback) {
  var iframe = createElement('iframe');
  iframe.src = url;
  document.body.appendChild(iframe);
  attatchEvent(iframe, callback);
}

function openByLink(url, callback) {
  var link = createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  attatchEvent(link, callback);
}

function attatchEvent(element, callback) {
  var body = document.body;
  var timer = void 0;
  var clear = function clear(event, isTimeout) {
    if (typeof callback === 'function') callback(isTimeout);
    window.removeEventListener('pagehide', hide, true);
    window.removeEventListener('pageshow', hide, true);
    if (!element) return;
    element.onload = null;
    body.removeChild(element);
    element = null;
  };
  var hide = function hide(event) {
    clearTimeout(timer);
    clear(event, false);
  };
  window.addEventListener('pagehide', hide, true);
  window.addEventListener('pageshow', hide, true);
  var beforeTime = +new Date();
  timer = setTimeout(function () {
    timer = setTimeout(function () {
      var afterTime = +new Date();
      if (afterTime - beforeTime < 1300) {
        clear(null, false);
      } else {
        clear(null, true);
      }
    }, 1200);
  }, 60);
}

function open$1(url, callback) {
  if (!url) return;

  if (isWeChat() || isMobileQQ()) {
    // 微信和手机QQ都不能打开回调 false
    callback(false);
  } else if (isiOS()) {
    // ios 9 safari 不支持iframe的方式跳转
    openByLink(url, callback);
  } else if (isAndroidChrome()) {
    // Android chrome 不支持iframe 方式唤醒
    // 适用：chrome,leibao,mibrowser,opera,360
    openByLink(url, callback);
  } else {
    // 其他浏览器
    // 适用：UC,sogou,firefox,mobileQQ
    openByIframe(url, callback);
  }
}

var PROTOCAL = 'xxd';

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var config = {
  protocal: PROTOCAL
};

function open(params, callback) {
  var prefix = config.protocal + '://pagename=';
  if (!params) open$1(prefix + 'home');
  if (typeof params === 'function') open$1(prefix + 'home', params);
  var pagename = params.pagename,
      obj = objectWithoutProperties(params, ['pagename']);

  var schema = prefix + encodeURIComponent(pagename) + (obj && Object.keys(obj).length !== 0 ? '?' + stringify(obj) : '');
  open$1(schema, callback);
}

var ua = { isAndroid: isAndroid, isMobileQQ: isMobileQQ, isiOS: isiOS, isWeChat: isWeChat };

var main = {
  open: open,
  ua: ua,
  config: config
};

export default main;
