const fs = require("fs");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const packageJson = require("./package.json");

// NorthWestWind's setup: each file is one script, so I create entry for each of them
const entry = {};
for (const file of fs.readdirSync("./src/")) {
  const basename = file.split(".").slice(0, -1);
  entry[basename] = `./src/${file}`;
}

module.exports = {
  target: "node",
  mode: "production",
  devtool: false,
  entry,
  output: {
    libraryTarget: "commonjs2",
    libraryExport: "default",
    path: path.resolve(__dirname, "./dist"),
    filename: `[name].js`,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  optimization: {
    minimize: true,

    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: /main/,
          mangle: false,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
