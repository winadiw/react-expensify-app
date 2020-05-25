// entry -> output
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "test") {
  require("dotenv").config({
    path: ".env.test",
  });
} else if (process.env.NODE_ENV === "development") {
  require("dotenv").config({
    path: ".env.development",
  });
}

module.exports = (env) => {
  const isProduction = env === "production";
  const CSSExtract = new MiniCssExtractPlugin({ filename: "styles.css" });

  return {
    entry: "./src/app.js", //entry point for ReactDOM
    output: {
      //output dir to server
      path: path.join(__dirname, "public", "dist"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          //to parse jsx, using babel loader
          loader: "babel-loader",
          test: /\.js$/, //only files that meet this criteria,
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [CSSExtract, new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID)
    })],
    devtool: isProduction ? "source-map" : "cheap-module-eval-source-map", //handle super large files ize
    devServer: {
      contentBase: path.join(__dirname, "public"), //to serve using webpack-dev-server,
      historyApiFallback: true, //for client side routing
      publicPath: "/dist/",
    },
  };
};
