const webpack = require("webpack");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

const envFile = isDevelopment
  ? path.resolve(__dirname, "dev.env")
  : path.resolve(__dirname, "prod.env");

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
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.worker$/,
        use: { loader: "worker-loader", options: { inline: "fallback" } },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // only enable React Refresh plugin in development
            plugins: isDevelopment ? ["react-refresh/babel"] : [],
          },
        },
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
    // only include React Refresh in development
    ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : []),
  ],
  devServer: isDevelopment
    ? {
        static: { directory: path.join(__dirname, "public") },
        historyApiFallback: true,
        hot: true,
        liveReload: false,
        port: 3000,
        open: true,
        watchFiles: ["src/**/*"],
      }
    : undefined,
};
