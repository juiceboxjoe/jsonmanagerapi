'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSubSchema = mongoose.Schema({
  id: {
    type: Number,
    required: 'Please enter a link id.'
  },
  title: {
    type: String,
    required: 'Please enter a link title.'
  },
  uri: {
    type: String,
    required: 'Please enter a link uri.'
  }
},{ _id : false });

const resourceSubSchema = mongoose.Schema({
  anchor: {
    type: String,
    required: 'Please enter a resource anchor.'
  },
  position: {
    type: String,
    required: 'Please enter a resource position.'
  },
  link:{
    type: Number,
    required: 'Please enter a link id.'
  }
},{ _id : false });

const JSONBlobSchema = new Schema({
  metaId: { 
    type: Schema.Types.ObjectId, 
    ref: 'JSONMeta',
    index: true,
    required: true
  },
  metaKey: { 
    type: String, 
    index: true,
    required: true
  },
  metaCreationDate: {
    type: Date,
    required: true
  },
  content: {
    html: {
      type: String,
      required: 'Please enter an html field.'
    },
    links: [linkSubSchema],
    resources: [resourceSubSchema],
  }
});

module.exports = mongoose.model('JSONBlob', JSONBlobSchema);