const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    filename: "main.js",
    path: "/Volumes/Media ( Main )/lms-boulez-theme-master",
    // path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "ts-loader",
          options: {
            //presets : ['@babel/preset-env', '@babel/preset-react']
          },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "source-map-loader",
      },
    ],
  },
  devtool: "source-map",
};
