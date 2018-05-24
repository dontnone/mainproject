(function (){
    var docEl = document.getElementsByTagName("html")[0];
    var dpr = window.devicePixelRatio || 1;
    var rem = docEl.clientWidth * dpr / 10;
    var scale = 1 / dpr;
    // 动态写入样式
    docEl.style.fontSize = rem*scale + 'px';
})();

window.onresize = function(){
    var docEl = document.getElementsByTagName("html")[0];
    var dpr = window.devicePixelRatio || 1;
    var rem = docEl.clientWidth * dpr / 10;
    var scale = 1 / dpr;
    // 动态写入样式
    docEl.style.fontSize = rem*scale + 'px';
};