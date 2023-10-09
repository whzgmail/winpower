const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const {VueLoaderPlugin} = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// console.log( __dirname,path.resolve('src/lib/util.js'),path.resolve('src') )

module.exports = {
    // entry: {
    //     'components':"./src/main.js",
    // },
    output: {
        // filename: "vue-com.js",
        // path: path.resolve(__dirname, "./../../public/static/js/vue"),
        filename: '[name].js',
        path: path.resolve(__dirname, "./public"),
        // publicPath: './'
    },
    externals: {
        // Vue: {
        //     commonjs: "Vue",
        //     commonjs2: "Vue",
        //     amd: "Vue",
        //     root: "Vue",
        // },
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: "Output Management",
        // }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    resolve: {
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js', // 用 webpack 1 时需用 'vue/dist/vue.common.js'
            '@': path.join(__dirname, "/../src/"),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/, // 排除文件
                loader: "babel-loader",
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',{loader:'less-loader',options:{ lessOptions: {javascriptEnabled:true} } }],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"],
            },
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ["file-loader"] },
        ],
    },
};
