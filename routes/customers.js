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
          console.log(user.id);
          helper.getAllComplaints(user.id).then(function(data) {
            res.status(200).send(data);
          });
        }
      );
    });
  });
}

function addComplaint(req, res) {
  var complaintRequest = req.body;
  //Create new complaint object
  var newComplaint = new Complaint();
  newComplaint.cust_id = complaintRequest.custId;
  newComplaint.status = complaintRequest.status;
  newComplaint.date_created = complaintRequest.dateCreated;
  newComplaint.date_updated = complaintRequest.dateUpdated;
  newComplaint.complaint_heading = complaintRequest.complaintHeading;
  newComplaint.complaint_description = complaintRequest.complaintDescription;
  newComplaint.comments = complaintRequest.comments;
  //save new Complaint details to DB
  newComplaint.save(function(err, data) {
    if (data) res.send(data);
    else if (err) res.status(400).send('User name or email already exists');
  });
}

module.exports = {
  getCustomerComplaints: getCustomerComplaints,
  addComment: addComment
};
