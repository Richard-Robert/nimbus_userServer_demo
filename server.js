var express = require('express');
var bodyparser = require('body-parser');
var chalk = require('chalk');

//Initialize DB connection and models
require('./models/db');
require('./models/counter');
require('./models/user');
require('./models/complaint');
//API routes
var AuthController = require('./auth/AuthController');
var customers = require('./routes/customers');
var agents = require('./routes/agents');

var app = express();

//Configuring app
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,x-access-token'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

//Creating server
var port = process.env.PORT || 8080;
var server = app.listen(port, function(req, res) {
  console.log(chalk.green('Server started at port : ' + port));
});

//API calls
app.get('/', function(req, res) {
  res.send('Nothing to see here :p !!!');
});

app.use('/api/auth', AuthController.router);

app.get(
  '/api/getAllCustomerComplaints',
  AuthController.isAuthenticatedAgent,
  agents.getAllCustomerComplaints
);

app.get(
  '/api/getCustomerComplaints',
  AuthController.isAuthenticatedCustomer,
  customers.getCustomerComplaints
);

app.put(
  '/api/addCustomerComment',
  AuthController.isAuthenticatedCustomer,
  customers.addComment
);

app.put(
  '/api/addAgentComment',
  AuthController.isAuthenticatedAgent,
  agents.addComment
);

app.put(
  '/api/updateComplaintStatus',
  AuthController.isAuthenticatedAgent,
  agents.changeStatus
);

app.put(
  '/api/logComplaint',
  AuthController.isAuthenticatedCustomer,
  customers.logComplaint
);
