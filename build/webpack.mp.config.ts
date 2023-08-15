import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMiniPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MpPlugin from "mp-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { merge } from 'webpack-merge';
import { webpackCommonBaseConfig, IS_DEV, pluginsConfig } from "./webpack.base.config";
import mpPluginConfig from "./mpPluginConfig";

const isOptimize = !IS_DEV; // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

const mpCustomConfig = {
  
}

const mpBaseConfig = {
  mode: 'production',
  optimization: {
    runtimeChunk: false, // 必需字段，不能修改
    splitChunks: {
      // 代码分隔配置，不建议修改
      chunks: 'all',
      minSize: 1000,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
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

    minimizer: isOptimize
      ? [
          // 压缩CSS
          new CssMiniPlugin({
            test: /\.(css|wxss)$/g,
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                  minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                },
              ],
            },
          }),
          // 压缩 js
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
          }),
        ]
      : [],
  },
  target: 'web', // 必需字段，不能修改
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].wxss' }),
    new MpPlugin(mpPluginConfig),
    // new CopyPlugin({patterns: []}),
    new webpack.DefinePlugin(pluginsConfig.defines)
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  }
}

export default merge(mpBaseConfig, webpackCommonBaseConfig, mpCustomConfig);