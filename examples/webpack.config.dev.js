module.exports = {
  entry: './examples/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: { loader: 'babel-loader' },
    }],
  },
};
