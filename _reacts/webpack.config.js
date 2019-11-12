const path = require('path')

module.exports = {
  entry: {
    foo: './src/index.js',
    foo1: './src/App.js',
  },
  output: {
    path: path.join(__dirname, 'components'),
    filename: '[name]/dist/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env', 'babel-preset-react'],
          },
        },
      },
    ],
  },
}