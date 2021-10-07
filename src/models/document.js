import { Schema, model } from 'mongoose';

// Create Schema
const DocumentSchema = new Schema({
  name: {
    type: String,
    default: "Untitled"
  },
  content: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  temp: { // change array to users with access
    type: String
  }
});

const Doc = model('doc', DocumentSchema);

export default Doc;