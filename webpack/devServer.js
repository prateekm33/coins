const webpackMerge = require("webpack-merge");
const commonConfig = require('./common.js');
const path = require('path');

module.exports = webpackMerge(commonConfig, {
  devtool : 'source-map',

  devServer : {
    compress : true,
    port : process.env.PORT,
    contentBase : path.resolve(__dirname, '..', 'client')
  }
});