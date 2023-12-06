const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_env, _argv) => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: "src/template.html",
      inject: false,
      templateParameters: (_compilation, assets) => {
        const outputFilename = assets.js.find((file) =>
          file.includes("os-custom-elements")
        );
        return {
          "os_custom_elements": outputFilename,
        };
      },
    }),
  ];

  return {
    entry: "./src/app.js",
    output: {
      filename: "os-custom-elements.[contenthash].min.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      static: path.resolve(__dirname, "dist"),
      port: 5050,
    },
    plugins,
  };
};
