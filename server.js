var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var db = require('./models/db.js');

var app = express();

//Configuring server
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Creating server
var port = process.env.PORT || 8080;
var server = app.listen(port, function(req, res) {
    console.log(chalk.green("Server started at port : " + port));
});