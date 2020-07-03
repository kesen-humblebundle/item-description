const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["./client/index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "client", "src", "index.html"),
    }),
    new Dotenv(),
  ],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "babel-plugin-styled-components",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-react-jsx",
            ],
          },
        },
      },
    ],
  },
};
