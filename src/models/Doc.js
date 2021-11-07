let { Schema, model } = require('mongoose');

// Create Schema
const DocumentSchema = new Schema({
  name: {
    type: String,
    default: "Untitled"
  },
  content: {
    type: String,
    default: ""
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String
  },
  creator: {
    type: String
  },
  access: {
    type: Array
  }
});

const Doc = model('docs', DocumentSchema);

module.exports = Doc;