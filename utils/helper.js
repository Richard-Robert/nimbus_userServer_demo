var mongoose = require('mongoose');

var User = mongoose.model('User');
var Complaint = mongoose.model('Complaint');

const CUSTOMER = 'customer';

function setNextSequenceId(Model, sequenceName) {
  Model.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { sequence_value: 1 } },
    function(err, data) {
      if (data) {
        console.log('Updated sequence value');
      }
    }
  );
}
async function getNextSequenceId(Model, sequenceName) {
  var nextSequenceId;
  var callBack = function(err, data) {
    nextSequenceId = data.sequence_value + 1;
  };
  await Model.findOne({ id: sequenceName }, callBack);
  return nextSequenceId;
}

async function getAllCustomers() {
  const customers = [];
  //Find all customers from DB
  await User.find({}, function(err, data) {
    data.forEach(function(obj) {
      if (obj.type === CUSTOMER) {
        obj.password = '0';
        customers.push(obj);
      }
    });
  });
  return customers;
}
async function getAllComplaints(userId) {
  var complaints = [];
  //Find all complaints of given user
  if (userId) {
    await Complaint.find({ cust_id: userId }, function(err, data) {
      complaints = data;
    });
  }
  //Find all complaints of all users
  else {
    await Complaint.find({}, function(err, data) {
      complaints = data;
    });
  }
  return complaints;
}

module.exports = {
  setNextSequenceId: setNextSequenceId,
  getNextSequenceId: getNextSequenceId,
  getAllCustomers: getAllCustomers,
  getAllComplaints: getAllComplaints
};
