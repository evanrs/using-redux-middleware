var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: (
    process.env.DEBUG ?
      'eval-source-map'
    : 'cheap-module-eval-source-map'),
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'DEVTOOLS', 'API_URL']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        query: {
  	      cacheDirectory: ! process.env.DEBUG
  	    },
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules/redux-namespace')
        ]
      },
      { test: /\.(less|css)$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap'
      }
    ]
  }
};
