
import WebpackMerge from 'webpack-merge'

import config from './webpack.config.js'
import * as paths from './paths.js'

export default (props) => {
  return WebpackMerge.merge(config(props), {
    stats: 'errors-only',
    mode: 'development',
    devServer: {
      static: {
        directory: paths.devServerDir,
        publicPath: '/assets'
      },
      port: 3000
    }
  })
}
