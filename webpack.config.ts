import path from "path";
import webpack from "webpack";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export default function webpackConfig(env: {
  demo: string;
}): webpack.Configuration {
  const { demo } = env;

  if (!demo) {
    throw new Error(
      'Please specify which demo to run using "demo" environment variable!'
    );
  }

  console.log(`Running demo "${demo}"...`);

  return {
    mode: "development",
    entry: `./src/${demo}/index.ts`,
    devtool: "eval-source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: { transpileOnly: true, experimentalWatchApi: true }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.svg$/,
          loader: "file-loader?name=[path][name].[hash].[ext]"
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "prosemirror-demo.bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".svg"],
      modules: ["node_modules", "../../node_modules"]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "Prosemirror Demo",
        template: `./src/${demo}/index.ejs`,
        hash: true
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 1234
    }
  };
}
