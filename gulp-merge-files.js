'use strict';
var through = require('through2');
var http = require('http');
var fs=require('fs');
function _fetch(opt,callback){
    var req = http.request({
        hostname:opt.hostname,
        port: opt.port||'80',
        path: opt.path,
        method: 'get'
    },function(res){
        var buf = [];
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data',function(chunk){
            buf.push(chunk);
        });
        var fileName = opt.path.substring(opt.path.lastIndexOf("\/")+1);
        var modName = opt.modName.length > 0 ? opt.modName+".":"";
        console.log (modName+fileName);

        var fileDirPath = "./static/merge/";
        var isDir= fs.existsSync(fileDirPath);
        if (!isDir) {
            console.log ("创建merge目录");
            fs.mkdirSync(fileDirPath);
        } else {
            console.log ("merge目录已经存在");
        }
        res.pipe(fs.createWriteStream('./static/merge/'+modName+fileName));
        res.on('end',function(){
            callback(Buffer.concat(buf));
        });
    });
    req.on('error',function(e){
        console.log(e);
    })
    req.end();
}
module.exports = function (options) {
    var len = options.length;
    if (!options || !options.length) {
        console.log ("Error: options is error!");
        return;
    }
    var fetchIndex = 0;
    return through.obj(function (file, enc, cb) {
        var that = this;
        for (var i = 0 ; i < len;i++) {
            (function (option){
                _fetch(option,function (buf) {
                    file.contents = Buffer.concat([file.contents,buf]);
                    that.push(file);
                    fetchIndex++;
                    if (fetchIndex==len) { //最后一个,所有的js已经完成
                        cb();
                    }
                });
            })(options[i]);
        }
    });
};
