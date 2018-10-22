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
  const result = await Model.findOne({ id: sequenceName });
  return result.sequence_value+1;
}

async function getAllCustomers() {
  const customers = [];
  //Find all customers from DB
  const result = await User.find({});
  result.forEach(function(obj) {
    if (obj.type === CUSTOMER) {
      obj.password = '0';
      customers.push(obj);
    }
  });
  return customers;
}
async function getAllComplaints(userId) {
  var complaints = [];
  //Find all complaints of given user
  if (userId) {
   complaints = await Complaint.find({ cust_id: userId });
  }
  //Find all complaints of all users
  else {
     complaints = await Complaint.find({});
  }
  return complaints;
}

module.exports = {
  setNextSequenceId: setNextSequenceId,
  getNextSequenceId: getNextSequenceId,
  getAllCustomers: getAllCustomers,
  getAllComplaints: getAllComplaints
};
