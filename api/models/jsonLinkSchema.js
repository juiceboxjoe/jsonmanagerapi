'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSubSchema = mongoose.Schema({
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

var JSONLinkSchema = new Schema({
  metaId:{ 
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
  content: linkSubSchema
});

module.exports = mongoose.model('Link', JSONLinkSchema);