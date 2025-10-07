const webpack = require("webpack");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "prod.env")
    : path.resolve(__dirname, "dev.env");

const myEnv = dotenv.config({ path: envFile });
dotenvExpand.expand(myEnv);

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    globalObject: "self",
    publicPath: "",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.worker$/,
        use: { loader: "worker-loader", options: { inline: "fallback" } },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
        dependency: { not: ["url"] },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"),

      //vscode: "@codingame/monaco-vscode-api",

      "vscode-languageclient": "vscode-languageclient/browser.js",
    },
    mainFields: ["browser", "module", "main"],
    fallback: {
      fs: false,
      path: false,
      os: false,
      crypto: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    port: 3000,
    open: true,
    watchFiles: ["src/**/*"],
  },
};
