var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());
var mongoose = require('mongoose');
//For authentication
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
//models
var Counter = mongoose.model('Counter');
var User = mongoose.model('User');

var helper = require('../utils/helper');
const CUSTOMER = 'customer';

router.post('/registerCustomer', function(req, res) {
  const custRequest = req.body;
  const hashedPassword = bcrypt.hashSync(custRequest.password, 8);
  //create new Customer object
  var newCustomer = new User();
  helper.getNextSequenceId(Counter, 'userID').then(function(data, err) {
    if (data) {
      newCustomer.id = data;
      console.log('New sequence ID :' + newCustomer.id);
      newCustomer.type = CUSTOMER;
      newCustomer.email = custRequest.email.toLowerCase();
      newCustomer.phone = custRequest.phone;
      newCustomer.password = hashedPassword;
      //save new Customer details to DB
      newCustomer.save(function(err, user) {
        if (err) {
          if (err.errmsg.indexOf('dup key')) {
            return res
              .status(400)
              .send('Email Id or Phone nnumber already exists!!');
          }
          return res
            .status(500)
            .send('There was a problem registering the user.');
        }
        helper.setNextSequenceId(Counter, 'userID');
        console.log('Successfully Added record');
        // create a token
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
      });
    } else {
      res
        .status(500)
        .send('There was a problem accessing the DB , Please try again' + err);
    }
  });
});

router.post('/login', function(req, res) {
  const loginRequest = req.body;
  //create new Customer object
  User.findOne({ email: loginRequest.email.toLowerCase() }, function(
    err,
    data
  ) {
    if (err) {
      return res.status(400).send('Invalid credentials');
    }
    var user = data;
    if (
      user.email === loginRequest.email.toLowerCase() &&
      user.phone === loginRequest.phone &&
      bcrypt.compareSync(loginRequest.password, user.password)
    ) {
      var token = jwt.sign({ id: user.id, type: user.type }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, userType: user.type });
    } else {
      return res.status(400).send('Invalid credentials');
    }
  });
});

function isAuthenticatedAgent(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }
    User.findOne({ id: decoded.id }, function(err, user) {
      if (err)
        return res.status(500).send('There was a problem finding the user.');
      if (!user) return res.status(404).send('No user found.');
      if (user.type !== 'agent') {
        res.status(404).send('Unathorized Access');
      }
    });
  });
  next();
}

function isAuthenticatedCustomer(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }
    User.findOne({ id: decoded.id }, function(err, user) {
      if (err)
        return res.status(500).send('There was a problem finding the user.');
      if (!user) return res.status(404).send('No user found.');
      if (user.type !== 'customer') {
        res.status(404).send('Unathorized Access');
      }
    });
  });
  next();
}
module.exports = {
  router: router,
  isAuthenticatedAgent: isAuthenticatedAgent,
  isAuthenticatedCustomer: isAuthenticatedCustomer
};
