import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import portfinder from 'portfinder';
import TerserPlugin from 'terser-webpack-plugin';
import CssMiniPlugin from "css-minimizer-webpack-plugin";
import { webpackCommonBaseConfig, pluginsConfig, getAbsPath, IS_DEV } from "./webpack.base.config";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import ExtensionPlugin from '../scripts/extension-webpack-plugin';

const IS_DEV_SERVER = Reflect.has(process.env, "DEV_SERVER");
const LOCALHOST_PORT = +(process.env.PORT || "") || 8080;

const htmlPluginList = IS_DEV_SERVER 
  ? pluginsConfig.generateHtml.map(name => {
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: 'index.dev.html',
      inject: true,
      chunks: [name],
    })
  }) 
  : pluginsConfig.generateHtml.map(name => {
    return new HtmlWebpackPlugin({
      filename: getAbsPath(`./dist/web/${name}.html`),
      template: 'index.prod.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunks: [name],
    });
  });

const webConfig: webpack.Configuration & {devServer?: any} = {
  devtool: IS_DEV ? "cheap-module-source-map" : false,
  module: {
    rules: [
      {
        test: /\.css$/,
        // @ts-ignore
        use: [ IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(pluginsConfig.defines),
    ...htmlPluginList,
    // new CopyPlugin({ patterns: [] }),
  ]
}

if (IS_DEV_SERVER) { // Developement mode.
  console.log("webpack-dev-server mode");
  webConfig.devServer = {
    historyApiFallback: {
      rewrites: [{from: /.*/, to: '/index.html'}],
    },
    hot: true,
    compress: true,
    host: process.env.HOST || 'localhost',
    port: LOCALHOST_PORT,
    open: true, // 自动打开浏览器
    client: {
      logging: 'warn',
      overlay: { // 展示全屏报错
        warnings: false,
        errors: true
      },
    },
    static: {
      publicPath: '/',
    },
    proxy: {},
  }
  webConfig.watchOptions = {
    poll: false,
  }
  webConfig.plugins!.unshift(new webpack.HotModuleReplacementPlugin());
}

if (!IS_DEV) { // Production mode
  webConfig.optimization = {
    splitChunks: {
      // 代码分割配置
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      // 压缩CSS
      new CssMiniPlugin({
        test: /\.css$/g,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }
      }),
      // 压缩 js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
      }),
    ],
  }
  webConfig.plugins!.push(new MiniCssExtractPlugin({ filename: path.posix.join('static', 'css/[name].[hash].css') }));
  webConfig.plugins!.push(new webpack.ids.HashedModuleIdsPlugin())
}


if (!IS_DEV_SERVER && Reflect.has(pluginsConfig, "extensionManifest")) {
  webConfig.plugins!.push(new ExtensionPlugin(pluginsConfig.extensionManifest));
}

// @ts-ignore
const webpackConfig = merge(webConfig, webpackCommonBaseConfig);

export default IS_DEV_SERVER
  ? new Promise((resolve, reject) => {
    portfinder.basePort = LOCALHOST_PORT;
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // @ts-ignore
        webpackConfig.devServer.port = port;

        resolve(webpackConfig);
      }
    });
  }) 
  : webpackConfig;
