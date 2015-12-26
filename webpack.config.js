module.exports = {
  entry: "./src/app.jsx",
  output: {
    path: "./public",
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  }
};
