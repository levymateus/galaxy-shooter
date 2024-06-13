import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

export default (props) => {
  const { debug = false } = props;
  const { EnvironmentPlugin } = webpack;
  const __dirname = new URL('.', import.meta.url).pathname;
  const rootDir = path.resolve(__dirname, '..');
  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');
  const srcPath = path.resolve(rootDir, 'src/');
  const nodeModulesPath = path.resolve(rootDir, 'node_modules');
  const distPath = path.resolve(rootDir, 'dist');
  const config = {
    stats: 'verbose',
    mode: 'production',
    output: {
      filename: '[name].js',
      path: distPath,
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: [".ts", ".js", ".css", ".json"],
      modules: [srcPath, nodeModulesPath],
      plugins: [
        new TSConfigPathsPlugin({
          configFile: tsconfigPath
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'assets',
            to: 'assets'
          },
          {
            from: 'index.html',
            to: 'dist'
          },
          {
            from: 'favicon.ico',
            to: './'
          }
        ]
      }),
      new HTMLWebpackPlugin({
        template: 'index.html',
        filename: 'index.html'
      }),
      new EnvironmentPlugin({ debug }),
    ]
  }
  return config;
}
