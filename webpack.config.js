const { resolve, join } = require('path'); //node内置核心模块，用来设置路径。
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = function (options) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    watch: process.env.NODE_ENV === 'development',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [...options.plugins, new webpack.HotModuleReplacementPlugin()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.less'],
      alias: {
        localSrc: join(__dirname, './src'),
        crud: join(__dirname, './src/APP/CRUD'),
        localConfigs: join(__dirname, './configs'),
        '~': './',
      },
    },
  };
};
