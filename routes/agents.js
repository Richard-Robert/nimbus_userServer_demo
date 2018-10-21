var chalk = require('chalk');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Counter = mongoose.model('Counter');
var User = mongoose.model('User');
var Complaint = mongoose.model('Complaint');
var helper = require('../utils/helper');
var config = require('../auth/config');

const CUSTOMER = 'customer';

function getAllCustomerComplaints(req, res) {
  sendFormattedComplaints(res);
}

function addComment(req, res) {
  var complaintId = req.body.complaintId;
  var newComment = req.body.newComment;
  var newCommentTime = req.body.commentTime;
  var emailId;
  var newCommentObject = {};
  var token = req.headers['x-access-token'];
  jwt.verify(token, config.secret, function(err, decoded) {
    User.findOne({ id: decoded.id }, function(err, user) {
      emailId = user.email;
      newCommentObject['comment'] = newComment;
      newCommentObject['date'] = newCommentTime;
      newCommentObject['email'] = emailId;
      Complaint.updateOne(
        { id: complaintId },
        {
          $push: { comments: newCommentObject }
        },
        function(err, complaint) {
          helper.getAllComplaints().then(function(data) {
            res.status(200).send(data);
          });
        }
      );
    });
  });
}
function changeStatus(req, res) {
  var complaintId = req.body.complaintId;
  var newStatus = req.body.newStatus;
  var updatedTime = req.body.updatedTime;
  Complaint.updateOne(
    { id: complaintId },
    {
      $set: { status: newStatus, date_updated: updatedTime }
    },
    function(err, complaint) {
      sendFormattedComplaints(res);
    }
  );
}
function sendFormattedComplaints(res) {
  var customers, complaints;
  helper.getAllCustomers().then(function(data) {
    customers = data;
    helper.getAllComplaints().then(function(data) {
      complaints = data;
      result = JSON.parse(JSON.stringify(complaints));
      for (const customer of customers) {
        for (const complaint of result) {
          if (complaint.cust_id === customer.id) {
            complaint['email'] = customer.email;
          }
        }
      }
      res.send(result);
    });
  });
}

module.exports = {
  getAllCustomerComplaints: getAllCustomerComplaints,
  addComment: addComment,
  changeStatus: changeStatus
};
