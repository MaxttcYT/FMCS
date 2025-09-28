const webpack = require("webpack");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Set environment-specific `.env` file
const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "prod.env") // Load prod.env for production
    : path.resolve(__dirname, "dev.env"); // Load dev.env for development

const myEnv = dotenv.config({ path: envFile });
dotenvExpand.expand(myEnv);

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  mode: "development",
  module: {
    rules: [
      // Process JavaScript and JSX files via Babel.
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      // Process plain CSS files (if any)
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // Process SCSS files: compile, then load into style-loader.
      {
        test: /\.(scss|sass)$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader", // compiles Sass to CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"), // points @ to the project root
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // serve public assets
    },
    historyApiFallback: true,
    hot: true, // enable HMR for fast updates
    liveReload: true, // fallback full reload if HMR fails
    port: 3000,
    open: true,
    watchFiles: ["src/**/*"], // watch all source files
  },
};
