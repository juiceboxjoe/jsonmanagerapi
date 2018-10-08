'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourceSubSchema = mongoose.Schema({
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

var JSONResourceSchema = new Schema({
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
  },metaCreationDate: {
    type: Date,
    required: true
  },
  metaCreationDate: {
    type: Date,
    required: true
  },
  content: resourceSubSchema
});

module.exports = mongoose.model('Resource', JSONResourceSchema);