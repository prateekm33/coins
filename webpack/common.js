const path = require('path');
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
    rules : [ babelLoaderRules ]
  },

  externals : setupExternals(),

  resolve : {
    modules : [
      'node_modules',
      path.resolve(__dirname, '..', 'client')
    ]
  }
};