var mongoose = require('mongoose');
const complaintSchema = new mongoose.Schema(
  {
    id: { type: Number },
    cust_id: { type: Number },
    status: { type: Number },
    date_created: { type: Date },
    date_updated: { type: Date },
    heading: { type: String },
    description: { type: String },
    comments: { type: [] }
  },
  { collection: 'Complaints' }
);

// Build the customer model
mongoose.model('Complaint', complaintSchema);
