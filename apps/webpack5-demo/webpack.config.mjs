import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import webpack from 'webpack';

import {
  ASSETS_FILE_NAME,
  OUTPUT_DIR,
  SRC_DIR,
  SVG_ICON_DIR,
} from './config.mjs';
const { DefinePlugin, ProvidePlugin } = webpack;
const __filename = fileURLToPath(import.meta.url);
const isProduction = process.env.NODE_ENV == 'production';
const isAnalyze = process.argv.includes('--analyze');

const stylesHandler = (options) => {
  const styleLoaders = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      // https://github.com/webpack-contrib/css-loader
      loader: 'css-loader',
      options: {
        url: {
          filter: () => {
            return true;
          },
        },
        import: {
          filter: () => {
            return true;
          },
        },
        modules: {
          mode: 'icss',
        },
        sourceMap: !isProduction,
        importLoaders: 2,
        ...options?.css,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ];
  return styleLoaders;
};

const config = {
  entry: './src/index.ts',
  output: {
    path: OUTPUT_DIR,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      title: 'webpack5-demo',
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_OPTIONS_API__: false,
    }),
    // https://webpack.js.org/plugins/provide-plugin/
    new ProvidePlugin({
      // _: 'lodash',
      // $: 'jquery',
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    generator: {},
    parser: {},
    rules: [
      {
        test: /\.(tsx)$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsxSuffixTo: [/\.vue$/i],
            },
          },
        ],
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(js|mjs|ts)$/i,
        use: ['babel-loader'],
        include: [SRC_DIR],
        exclude: [],
      },
      {
        test: /\.vue$/i,
        use: [
          {
            loader: 'vue-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [...stylesHandler(), 'sass-loader'],
        exclude: [/\.module\.scss$/i],
      },
      {
        test: /\.module\.scss$/i,
        exclude: [/node_modules/i],
        use: [
          ...stylesHandler({
            css: {
              mode: 'local',
            },
          }),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [...stylesHandler()],
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        exclude: [/\.9\.png$/],
        // https://webpack.js.org/guides/asset-modules/
        type: 'asset',
        generator: {
          filename: ASSETS_FILE_NAME,
        },
      },
      /* svg */
      {
        test: /\.(svg)(\?.*)?$/,
        exclude: [SVG_ICON_DIR],
        type: 'asset/resource',
        generator: {
          filename: ASSETS_FILE_NAME,
        },
      },
      /* 点九图 */
      {
        test: /\.9\.png$/,
        type: 'asset/resource',
        generator: {
          filename: ASSETS_FILE_NAME,
        },
      },
      /* media */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: ASSETS_FILE_NAME,
        },
      },
      /* fonts */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset/resource',
        generator: {
          filename: ASSETS_FILE_NAME,
        },
      },
      /* less */
      {
        test: /\.less$/,
        use: [
          ...stylesHandler(),
          {
            loader: 'less-loader',
          },
        ],
      },
      { test: /\.json$/, type: 'json' },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    symlinks: true,
    alias: {
      '@': SRC_DIR,
    },
    extensions: ['.tsx', '.ts'],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins.push(
      // https://github.com/webpack-contrib/mini-css-extract-plugin
      new MiniCssExtractPlugin({
        filename: 'assets/[name].[contenthash:8].css',
      })
    );
    if (isAnalyze) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    config.output = {
      path: OUTPUT_DIR,
      clean: true,
      filename: 'assets/[name].[contenthash:8].js',
      chunkFilename: 'assets/[name].[contenthash:8].chunk.js',
    };
    config.devtool = 'source-map';
    config.optimization = {
      minimize: true,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
            reuseExistingChunk: true,
            name: 'vendors',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: 'common',
          },
        },
      },
    };
  } else {
    config.mode = 'development';
    config.devServer = {
      host: 'localhost',
    };
    config.output = {
      path: OUTPUT_DIR,
      clean: true,
    };
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        // This makes all dependencies of this file - build dependencies
        config: [__filename],
      },
    };
    config.devtool = 'inline-source-map';
    config.optimization = {
      usedExports: true,
      runtimeChunk: 'single',
    };
  }
  return config;
};
