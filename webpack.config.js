const fs = require("fs");
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
        const richTextFilename = assets.js.find((file) =>
          file.includes("os-rich-text")
        );
        return {
          "os_custom_elements": outputFilename,
          "os_rich_text": richTextFilename,
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
          for (const filename in assets) {
            let sourceFile;
            let componentName;

            const regex = /os-(.*?)\..*.min.js$/;
            const match = filename.match(regex);
            if (match) {
              componentName = match[1];
              sourceFile = filename;
            }

            if (sourceFile) {
              const sourcePath = path.resolve(__dirname, "dist", sourceFile);
              const destPath = path.resolve(
                __dirname,
                "dist",
                `os-${componentName}-${VERSION}.min.js`,
              );

              fs.copyFile(sourcePath, destPath, (err) => {
                if (err) throw err;
                console.log(`${sourceFile} was copied to ${destPath}`);
              });
            }
          }
        });
      },
    });
  }

  return {
    entry: {
      "custom-elements": "./src/app.js",
      "country": "./src/components/country.js",
      "file-upload": "./src/components/file_upload.js",
      "signature": "./src/components/signature.js",
      "table": "./src/components/table.js",
      "rich-text": "./src/components/rich_text/index.js",
    },
    output: {
      filename: "os-[name].[contenthash].min.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "src/components/rich_text"),
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        },
      ],
    },
    devServer: {
      static: path.resolve(__dirname, "dist"),
      port: 5050,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    plugins,
  };
};
