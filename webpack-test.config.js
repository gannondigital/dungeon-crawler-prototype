const path = require('path');
const TapWebpackPlugin = require('tap-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  bail: true,
  mode: 'development',
  entry: './test/index.spec.js',
  output: {
    path: path.resolve(__dirname, 'build', 'test'),
    filename: 'test.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        exclude: /node_modules/,
        use: ['file-loader', 'image-webpack-loader']
      }
    ]
  },
  plugins: [
    new TapWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  }
};