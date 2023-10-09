const {merge} = require('webpack-merge');
const common = require('./base.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const webpackMock = require('webpack-api-mocker');
const path = require('path');

module.exports = merge(common,{
    entry: path.join(__dirname, "/../src/main.js"),
    devtool: "cheap-source-map",
    mode:'development',
    devServer: {
        compress: true,
        host: "127.0.0.1",
        port: 8080,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "debug",
            template: path.join(__dirname, "/../index.ejs"),
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),
    ],
    optimization: {
        runtimeChunk: 'single'
    },
});
