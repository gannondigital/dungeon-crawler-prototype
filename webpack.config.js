const path = require("path");

module.exports = {
  bail: true,
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    contentBase: "./build"
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        exclude: /node_modules/,
        use: ["file-loader", "image-webpack-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".scss"]
  }
};
