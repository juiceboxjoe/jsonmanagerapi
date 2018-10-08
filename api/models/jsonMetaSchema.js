'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var JSONMetaSchema = new Schema({
  key: {
    type: String,
    index : true,
    required: true
  },
  html: {
    type: String,
    required: 'Please enter an html field'
  },
  links: [{ type: Schema.Types.ObjectId, ref: 'Links' }],
  resources: [{ type: Schema.Types.ObjectId, ref: 'Resources' }],
  creationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JSONMeta', JSONMetaSchema);