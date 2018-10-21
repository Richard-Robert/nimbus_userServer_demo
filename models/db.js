var chalk = require('chalk');
var mongoose = require('mongoose');

var dbURI = 'mongodb://Richard:Richard1@ds135413.mlab.com:35413/nimbus_users';

mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useCreateIndex: true }
);

mongoose.connection.on('connected', function() {
  console.log(chalk.blue('Mongoose connected to -' + dbURI));
});

mongoose.connection.on('error', function(err) {
  console.log(chalk.red('Mongoose connection error: -' + err));
});

mongoose.connection.on('disconnected', function() {
  console.log(chalk.yellow('Mongoose disconnected'));
});
