var path = require('path');
var express = require('express');
var webpack = require('webpack');
var ip = require('ip');
var chalk = require('chalk');

var config = require('./webpack.config.dev');


var port = process.env.PORT || 3000;
var app = express();
var compiler = webpack(config);
// Njg5ODg
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  stats: {
    colors: true,
    chunks: false,
    cached: true,
    errorDetails: true
  },
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/static', express.static('static'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Server started ' + chalk.green('✓'));
    console.log(
      chalk.bold('\nAccess URLs:') +
      chalk.gray('\n-----------------------------------') +
      '\n   Local: ' + chalk.magenta('http://localhost:' + port) +
      '\nExternal: ' + chalk.magenta('http://' + ip.address() + ':' + port) +
      chalk.gray('\n-----------------------------------')
    );
    console.log(chalk.blue('\nPress ' + chalk.italic('CTRL-C') + ' to stop'));
  }
});
