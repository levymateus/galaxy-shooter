import config from './webpack.config.js';
import WebpackMerge from 'webpack-merge';
import * as path from 'path';

export default (props) => {
  const __dirname = new URL('.', import.meta.url).pathname;
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = path.join(rootDir, 'assets');
  return WebpackMerge.merge(config(props), {
    stats: 'errors-only',
    mode: 'development',
    devServer: {
      static: {
        directory: devServerDir,
        publicPath: '/assets'
      },
      port: 3000
    }
  });
}
