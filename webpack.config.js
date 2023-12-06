const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

const VERSION = "v1";

module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";

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
    new UnminifiedWebpackPlugin(),
  ];

  if (isProduction) {
    plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
          const assets = compilation.assets;
          let sourceFile;

          for (const filename in assets) {
            if (
              filename.startsWith("os-custom-elements") &&
              filename.endsWith(".js")
            ) {
              sourceFile = filename;
              break;
            }
          }

          if (sourceFile) {
            const sourcePath = path.resolve(__dirname, "dist", sourceFile);
            const destPath = path.resolve(
              __dirname,
              "dist",
              `os-custom-elements-${VERSION}.min.js`,
            );

            fs.copyFile(sourcePath, destPath, (err) => {
              if (err) throw err;
              console.log(`${sourceFile} was copied to ${destPath}`);
            });
          }
        });
      },
    });
  }

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
