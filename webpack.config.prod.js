const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const config = require(__dirname + '/webpack.config.js');
const { merge } = require('webpack-merge');

module.exports = (props) => {
  return merge(config(props), {
    stats: 'verbose',
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new JsonMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
      },
    },
  })
}
