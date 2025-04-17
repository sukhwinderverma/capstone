const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:4005", // server port
        pathRewrite: { "^/api": "" },
      },
    ],
    open: true,
    port: 3006, // client port
    host: "0.0.0.0",
    historyApiFallback: { index: "index.html" },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|jpeg)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Add support for JSX files
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ExploreKWC",
      template: "template_index.html",
      filename: "./index.html",
    }),
  ],
  mode: "development",
};

module.exports = () => {
  return config;
};
