const config = require(__dirname + '/webpack.config.js');
const { merge } = require('webpack-merge');

module.exports = (props) => {
  return merge(config(props), {
    stats: 'verbose',
    mode: 'production',
  })
}
