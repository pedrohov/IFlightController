const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src/index.jsx"),
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    // allows absolute imports from "src"
    modules: [path.join(__dirname, "src"), "node_modules"],
    extensions: ["", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(__dirname, "src/index.html") }),
  ],
};
