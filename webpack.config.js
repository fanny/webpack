const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const {getStyleLoaders, getBabelLoader} = require('./utils');
const PurifyCSSPlugin = require('purifycss-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWepackPlugin = require('html-webpack-plugin');

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;
const IMAGE_REGEX = /\.(png|jpg)$/;
const SVG_REGEX =  /\.svg$/;
const JS_REGEX = /\.js$/;
const SITEDIR = path.join(__dirname, 'src');

const isProd = process.env.NODE_ENV === 'production';

// TODO: separate confs and add type script
module.exports = {
  plugins: [
    new HtmlWepackPlugin({
      title: 'My Webpack setup'
    }),
    // This is necessary to emit hot updates for webpack-dev-server.
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name]_[contenthash:8].css': '[name].css',
      chunkFilename: isProd ? '[name]_[contenthash:8].css': '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: CSS_REGEX,
        exclude: CSS_MODULE_REGEX,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: !isProd,
        })
      },
      {
        test: CSS_MODULE_REGEX,
        use: getStyleLoaders({
          localIdentName: isProd
            ? `[local]_[hash:base64:4]`
            : `[local]_[path]`,
          importLoaders: 1,
          sourceMap: !isProd,
        })
      },
      {
        test: IMAGE_REGEX,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          }
        }
      },
      {
        test: SVG_REGEX,
        use: "file-loader"
      },
      {
        test: JS_REGEX,
        include: SITEDIR,
        exclude: /node_modules/,
        use: getBabelLoader()
      }
    ]
  },
  devServer: {
    // Display only errors to reduce the amount of output.
    stats: "errors-only",
    // Don't refresh if hot loading fails. Good while
    // implementing the client interface.
    hot: true,
    hotOnly: true,
    clientLogLevel: 'error',
    compress: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    headers: {
      'access-control-allow-origin': '*',
    },

    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: "0.0.0.0";
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    open: true, // Open the page in browser,
    overlay: true
  }
};
