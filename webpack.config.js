const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["./client/index.js"],
  target: "node",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "html_template.html"),
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "minify"],
            plugins: [
              "babel-plugin-styled-components",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-react-jsx",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /(node_modules|bower_components)/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
