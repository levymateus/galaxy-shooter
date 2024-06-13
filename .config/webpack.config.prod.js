import JsonMinimizerPlugin from "json-minimizer-webpack-plugin";
import webpackMerge from 'webpack-merge';

import config from './webpack.config.js';

export default (props) => {
  return webpackMerge.merge(config(props), {
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
