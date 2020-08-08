const path = require("path");

module.exports = {
  entry: "./src/tampermonkey-script/main.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "tampermonkey-script.js",
    path: path.resolve(__dirname, "..", "..", "dist"),
  },
  optimization: {
    minimize: false,
  },
};
