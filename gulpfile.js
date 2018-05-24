var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');
var mincss = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var base64 = require('gulp-base64');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var isDebug = false; //是否压缩代码
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

gulp.task('sassMin', ["clean" , "buildStaticCss"], function () {

    staticCss = false;

    return gulp.src(['./pages/**/*/index.scss'])
        .pipe(sass())
        .pipe(base64({
            extensions: ['png','jpg'],
            maxImageSize: 20*1024, // bytes
            debug: true
        }))
        .pipe(mincss())
        .pipe(rename({
            basename: "_"
        }))
        .pipe(gulp.dest('./static/mods/'));
});

/**
 * 原来没有用px2rem 转换工具，所以，怕影响别人的代码，这里匹配的名字跟以前的不一样，
 * postcss https://github.com/postcss/gulp-postcss
 */
gulp.task('sassMin-px', ["clean" , "buildStaticCss"], function () {

    staticCss = false;
    var processors = [px2rem({remUnit: 75})];
    return gulp.src(['./pages/**/*/index-px.scss'])
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(base64({
            extensions: ['png','jpg'],
            maxImageSize: 20*1024, // bytes
            debug: true
        }))
        .pipe(mincss())
        .pipe(rename({
            basename: "_"
        }))
        .pipe(gulp.dest('./static/mods/'));
});

gulp.task("move" , function () {
    return gulp.src(["./pages/**/fonts/**/*" ,"./pages/**/imgs/**/*" ,"./pages/**/i/**/*" ])
        .pipe(cache(
            imagemin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })
        )).pipe(gulp.dest('./static/mods/'));
});


/********** html dev begin **********/

gulp.task("buildStaticFile" ,["buildStaticClean"], function () {
    return gulp.src(["./src/mods/**/fonts/**/*" ,"./src/mods/**/imgs/**/*" , "./src/mods/**/yhimgs/**/*" , "./src/mods/**/i/**/*" , "./src/mods/**/*.html" , "./src/mods/base.js"])
        .pipe(cache(
            imagemin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })))
        .pipe(gulp.dest('./static/html/'));
});

gulp.task("buildStaticCss" ,["buildStaticFile"], function (){
    return gulp.src(["./src/mods/**/*.scss"])
    .pipe(sass({
        "outputStyle": "expanded"
    }))
        .pipe(replace(/url\(\"\.\.\//ig,"url(\"/static/html/"))
        .pipe(replace(/url\(\'\.\.\//ig,"url(\'/static/html/"))
        .pipe( base64({
            extensions: ['png','jpg'],
            maxImageSize: 20*1024, // bytes
            debug: true
        }) )
        .pipe(gulp.dest('./static/html/'));
});

gulp.task('buildStaticClean', function (cb) {
    return del(['./static/html/**/*'],'./', cb)
});



gulp.task("dev" , ["buildStaticClean"] , function (){
    return gulp.start("buildStaticClean" , "buildStaticFile" , "buildStaticCss");
});

gulp.task("devWatch" , ["buildStaticClean"] , function (){
    gulp.watch(["./src/mods/**/fonts/**/*" ,"./src/mods/**/imgs/**/*" , "./src/mods/**/yhimgs/**/*" , "./src/mods/**/i/**/*" , "./src/mods/**/*.html" , "./src/mods/base.js"] , ["buildStaticFile"]);
    gulp.watch(["./src/mods/**/*.scss"], ["buildStaticCss"]);
});

/********** html dev end **********/



/**  js remote merge begin **/
var host = "stage-static.xxd.com" , versionPath="/js-bridge/1.1.1/dist/" , versionPcPath = "/pc/1.2.9.3/build/";
var mergeFile = require("./gulp-merge-files.js");
var fs = require('fs');
gulp.task('mergeRemoteJs',function(cb){
    var mergeList = [{
        hostname:'test-static.xxd.com',
        modName:"",
        path:versionPath+"xxd-jsBridge.esm.js"
    },{
        hostname:host,
        modName: "",
        path: versionPcPath + "js/tracker/track-base.js"
    }];
    return gulp.src("./static/merge/tmp.js")
        .pipe(mergeFile(mergeList));
});
/**  js remote merge end **/

/**  build filepckage */

gulp.task('buildfile', function(){
    var tmpPath = "./static/";
    var mergePath = "./static/merge/";
    var isPath = fs.existsSync(tmpPath);
    var isMerge = fs.existsSync(mergePath);
    if (!isPath)fs.mkdirSync(tmpPath,"0777");
    if (!isMerge)fs.mkdirSync(mergePath,"0777");
    fs.writeFile(mergePath + "/tmp.js", ";");
})



gulp.task('clean', function (cb) {
    return del(['./static/mods/*.css'],'./', cb)
});


gulp.task("watch", function () {
    isDebug = true;
    gulp.watch(['./pages/**/*.scss','./components/**/*.scss'], ['sassMin','sassMin-px']);
    gulp.watch(["./pages/**/fonts/**/*" ,"./pages/**/imgs/**/*"] , ["move"]);
});

gulp.task('default', ['clean'], function () {
    return gulp.start('clean', "sassMin" ,"sassMin-px", "move" , "buildfile",  "mergeRemoteJs");
});
