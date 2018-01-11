const path = require('path');
const webpack = require('webpack');

const babelLoader = {
  loader : 'babel-loader',
  options : {
    babelrc : false,
    presets : [
      'es2015',
      'react',
      'stage-2'
    ]
  }
}
const babelLoaderRules = {
  test : /\.jsx?$/,
  include : [path.resolve(__dirname, '..', 'client')],
  use : [ babelLoader ]
};

const fileLoaderRules = {
  test: /\.(png|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader'
    }
  ]
}

const setupExternals = () => {
  const externals = ['morgan', 'superagent-proxy'];
  const nodeLibraries = ['fs', 'net', 'tls'];
  externals.push(...nodeLibraries);
  return externals;
};

module.exports = {
  entry : {
    main : path.resolve(__dirname, '..', 'client')
  },

  output : {
    filename : '[name].bundle.js'
  },

  module : { 
    rules : [ babelLoaderRules, fileLoaderRules ]
  },

  externals : setupExternals(),

  resolve : {
    modules : [
      'node_modules',
      path.resolve(__dirname, '..', 'client')
    ]
  },

  plugins : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
    })
  ]
};