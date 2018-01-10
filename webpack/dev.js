const webpackMerge = require('webpack-merge');
const path = require("path");

module.exports = webpackMerge(require("./common.js"), {
  output : {
    path : path.resolve(__dirname, '..', 'client', 'dist')
  },

  devtool : 'source-map'
});