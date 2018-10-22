var chalk = require('chalk');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Counter = mongoose.model('Counter');
var User = mongoose.model('User');
var Complaint = mongoose.model('Complaint');

var helper = require('../utils/helper');
var config = require('../auth/config');

const CUSTOMER = 'customer';

function getCustomerComplaints(req, res) {
  var complaints;
  const customerId = req.body.id;
  helper.getAllComplaints(customerId).then(function(data) {
    complaints = data;
    res.send(complaints);
  });
}

async function addComment(req, res) {
  var complaintId = req.body.complaintId;
  var newComment = req.body.newComment;
  var newCommentTime = req.body.commentTime;
  var emailId;
  var newCommentObject = {};
  var token = req.headers['x-access-token'];
  jwt.verify(token, config.secret, async function(err, decoded) {
  const user = await User.findOne({ id: decoded.id });
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
        console.log(user.id);
        helper.getAllComplaints(user.id).then(function(data) {
          res.status(200).send(data);
        });
      }
    );
  });
}

function logComplaint(req, res) {
  var token = req.headers['x-access-token'];
  var complaintRequest = req.body;
  //Create new complaint object
  jwt.verify(token, config.secret, function(err, decoded) {
    var newComplaint = new Complaint();
    helper
      .getNextSequenceId(Counter, 'complaintID')
      .then(function(complaintId) {
        if (complaintId) {
          newComplaint.id = complaintId;
          newComplaint.cust_id = decoded.id;
          newComplaint.status = 1;
          newComplaint.date_created = complaintRequest.dateCreated;
          newComplaint.date_updated = complaintRequest.dateUpdated;
          newComplaint.heading = complaintRequest.complaintHeading;
          newComplaint.description = complaintRequest.complaintDescription;
          newComplaint.comments = [];
          //save new Complaint details to DB
          newComplaint.save(function(err, data) {
            if (data) {
              console.log(newComplaint);
              helper.setNextSequenceId(Counter, 'userID');
              helper
                .getAllComplaints(newComplaint.cust_id)
                .then(function(data) {
                  console.log(data);
                  res.status(200).send(data);
                });
            } else if (err) res.status(400).send(err);
          });
        } else {
          res
            .status(500)
            .send(
              'There was a problem accessing the DB , Please try again' + err
            );
        }
      });
  });
}

module.exports = {
  getCustomerComplaints: getCustomerComplaints,
  addComment: addComment,
  logComplaint: logComplaint
};
