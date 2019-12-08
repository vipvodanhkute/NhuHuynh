/* eslint-disable */
const withLess = require('@zeit/next-less');
const webpack = require('webpack');
const config = require('./config').config;
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const path = require('path');

module.exports = withBundleAnalyzer(withLess({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    }
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  assetPrefix: config.assetPrefix,
  webpack(config, options) {
    Object.assign(config.resolve.alias, {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './static/icons.js'),
      './data/packed/latest.json': path.resolve(__dirname, './static/timezone.json'),
    });

    config.plugins.push(
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    );

    config.module.rules.push({
      test: /\.(ico|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
      use: {
        loader: 'file-loader',
      }
    })
    config.module.rules.push({
      test: /\.(ttf|eot)$/i,
      use: {
        loader: 'file-loader',
        options: {
          name: '[path][names].[ext]',
          outputPath: 'static/'
        }
      }
    })
    return config;
  },
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    env: process.env.ENV || 'development',
  },
}))
