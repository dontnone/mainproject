const path = require('path');
console.log ("next.config.js  init ......");
//const cleanWebpackPlugin = require('clean-webpack-plugin');

//const extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    webpack:(config , {dev}) =>{

        console.log ("webpack...dev:::" + dev);


        //config.output.path = path.resolve(__dirname, './static2');//修改 .next 的编译路径
        //config.output.publicPath = path.resolve(__dirname, "/static");
        //
        // config.module.rules.push({
        //     test: /\.(css|scss)/,
        //     use:ExtractTextPlugin.extract({
        //         fallback:"style-loader",
        //         use: ['css-loader', 'sass-loader']
        //     })
        // });

        // console.log (path.resolve(__dirname, 'node_modules/antd-mobile'))
        //
        // config.devtool = "eval";
        // config.module.rules.push(
        //     {
        //         test: /\.css|less|scss$/,
        //         include: [
        //             path.resolve(__dirname, './pages'),
        //             path.resolve(__dirname, './node_modules/normalize.css'),
        //             path.resolve(__dirname, 'node_modules/antd-mobile')
        //         ],
        //         //exclude: /node_modules/,
        //         use: extractTextPlugin.extract({
        //             use: [{
        //                 loader: 'css-loader',
        //                 options: {
        //                     sourceMap: false,
        //                     importLoaders: 1
        //                 },
        //             }, {
        //                 loader: 'postcss-loader',
        //                 options: {
        //                     sourceMap: false,
        //                     plugins: function () {
        //                         return [
        //                             require('autoprefixer')({
        //                                 //browsers: ['ios >= 7.0']
        //                             })
        //                         ];
        //                     }
        //                 }
        //             }, {
        //                 loader: "sass-loader",
        //                 options: {
        //                     sourceMap: false,
        //                     outputStyle: 'compact'
        //                 }
        //             }],
        //             fallback: "style-loader",
        //             publicPath:"/static/"
        //         })
        //     }
        // );


        // config.module.rules.push(
        //     {
        //         test: /\.(css|scss)/,
        //         loader: 'emit-file-loader',
        //         options: {
        //             name: 'static/[path][name].[ext]'
        //         }
        //     },{
        //         test: /\.css$/,
        //         use: ['babel-loader', 'raw-loader', 'postcss-loader']
        //     },{
        //         test: /\.scss$/,
        //         use: ['babel-loader', 'raw-loader', 'postcss-loader', 'sass-loader',],
        //     }
        // );

        //config.plugins.push();


        // config.plugins.push(
        //     new cleanWebpackPlugin(['static/css'],{
        //         root: path.resolve(__dirname, './'),
        //         verbose: true,
        //         dry: false
        //     })
        // );

        // output: {
        //     path: path.resolve(__dirname, '../dist'),
        //         filename: "[name].bundle.js",
        //         chunkFilename: "[id].chunk.js",
        //         publicPath: "./"
        // }

        //config.plugins.push(new extractTextPlugin("[name].bundle.css"));



        var componentPath = path.resolve(__dirname, './components');

        console.log (componentPath);

        config.resolve.alias = {
            Ceiling:componentPath+"/ceiling/index.js"
        };




        return config;
    }
};