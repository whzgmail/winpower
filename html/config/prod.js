const {merge} = require("webpack-merge");
const path = require("path");
const common = require("./base.js");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
    // devtool: "inline-source-map",
    entry: path.join(__dirname, "/../src/main.js"),
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[id].[chunkhash].js',
        path: path.resolve(__dirname, "../dist"),
        publicPath: './'
    },
    mode: 'production',
    watch:false,
    optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new UglifyJSPlugin({ sourceMap: true }),
        new HtmlWebpackPlugin({
            title: "Power Manager",
            template: path.join(__dirname, "/../index.ejs"),
            inject: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        new CssMinimizerPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single'
    },
});
