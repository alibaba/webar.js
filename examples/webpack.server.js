const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basicConfig = require('./webpack.config.dev.js');

const config = merge(basicConfig, {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:3000',
    'webpack/hot/dev-server',
    basicConfig.entry,
  ],
  output: {
    publicPath: '/',
    filename: 'bundle.[hash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './examples/index.html',
    }),
  ],
  devtool: 'cheap-module-source-map',
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
    noInfo: true,
    quiet: true,
    chunks: false,
  },
}).listen(3000, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Listening at http://127.0.0.1:3000');
  }
});
