const path = require("path");

module.exports = {
  bail: true,
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    contentBase: "./dist"
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // @todo tune preset-env targets
            presets: [
              [
                '@babel/preset-env',
                {
                  debug: true
                }
              ],
              '@babel/preset-react'],
            plugins: []
          }
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        exclude: /node_modules/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".scss"]
  }
};
