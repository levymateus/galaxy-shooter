const config = require(__dirname + '/webpack.config.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = (props) => {
  return merge(config(props), {
    stats: 'errors-only',
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'assets'),
        publicPath: '/assets'
      },
      port: 3000
    }
  });
}
