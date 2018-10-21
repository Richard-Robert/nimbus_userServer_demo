var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Counter = mongoose.model('Counter');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    type: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, default: 0 }
  },
  { collection: 'Users' }
);

// Build the user model
mongoose.model('User', userSchema);

//code for adding agents manually
/*
var AGENT = 'agent';
var User = mongoose.model('User');
addAgent(1, AGENT, 'richard@gmail.com', 1234567890, 'richard');
function addAgent(id, type, email, phone, pwd) {
  //create new Agent object
  var newAgent = new User();
  getNextSequenceId(Counter, 'userID').then(function(data, err) {
    if (data) {
      newAgent.id = data;
      // console.log('New sequence ID :' + newAgent.id);
      newAgent.type = type;
      newAgent.email = email.toLowerCase();
      newAgent.phone = phone;
      newAgent.password = bcrypt.hashSync(pwd);
      //save new Agent details to DB
      newAgent.save(function(err, data) {
        if (data) {
          setNextSequenceId(Counter, 'userID');
          console.log('Successfully Added record');
        } else if (err) {
          console.log('Error while adding record - ', err);
        }
      });
    } else {
      console.log('Error while accessing DB , Try again- ', err);
    }
  });
}
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
  await Model.findOne({ id: sequenceName }, function(err, data) {
    nextSequenceId = data.sequence_value + 1;
  });
  return nextSequenceId;
}
*/
