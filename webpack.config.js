const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

module.exports = (props) => {
  const { debug = false } = props;
  const config = {
    stats: 'verbose',
    mode: 'production',
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: [".ts", ".js", ".css", ".json"],
      modules: [path.resolve(__dirname, 'src/'), path.resolve(__dirname, 'node_modules')],
      plugins: [
        new TSConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json')
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
