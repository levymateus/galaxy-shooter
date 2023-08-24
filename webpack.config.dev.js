const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'assets'),
      publicPath: '/assets'
    },
    port: 3000
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: [".js", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'dist/assets'
        },
        {
          from: 'index.html',
          to: 'dist'
        }
      ]
    }),
    new HTMLWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    })
  ]
}
