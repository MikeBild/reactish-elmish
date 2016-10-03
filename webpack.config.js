const HtmlWebpackPlugin = require('html-webpack-plugin');
const  webpack = require('webpack');

module.exports = {
  entry: './src/App.js',
  output: {
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.css/,
      loader: 'style!css',
    }, {
      test: /\.json$/,
      loader: 'json',
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]
};
