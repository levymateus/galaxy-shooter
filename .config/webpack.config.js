
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { cacheGroupChunkName } from './cacheGroupChunkName.js'

import * as paths from './paths.js'

export default (props) => {
  const { debug = false } = props
  const { EnvironmentPlugin } = webpack
  const config = {
    stats: 'verbose',
    mode: 'production',

    entry: {
      'commons-pixijs': ['pixi.js'],

      app: {
        import: './src/index.ts',
        dependOn: 'commons-pixijs',
      },
    },

    output: {
      filename: '[name].js',
      path: paths.distPath,
    },

    optimization: {
      splitChunks: {
        chunks: 'async',

        minSize: 20000,

        maxSize: 244000,

        minRemainingSize: 0,

        minChunks: 1,

        maxAsyncRequests: 30,

        maxInitialRequests: 30,

        enforceSizeThreshold: 50000,

        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,

            name: cacheGroupChunkName,

            reuseExistingChunk: true,

            chunks: 'all',
          },
        },
      },
    },

    devtool: 'inline-source-map',

    resolve: {
      extensions: [".ts", ".js", ".css", ".json"],
      modules: [paths.srcPath, paths.nodeModulesPath],
      plugins: [
        new TSConfigPathsPlugin({
          configFile: paths.tsconfigPath
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
  return config
}
