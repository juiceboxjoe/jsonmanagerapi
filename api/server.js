'use strict';

var express = require('express');
var logger = require('morgan');
const Promises = require('./controllers/utils/promises')

var mongoose = require('mongoose');
var JSONMeta = require('./models/jsonMetaSchema'); 
var JSONMeta = require('./models/jsonBlobSchema'); 
var Link = require('./models/jsonLinkSchema'); 
var Resource = require('./models/jsonResourceSchema'); 

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/JSONDB', { 
  useCreateIndex: true,
  useNewUrlParser: true 
}); 

var jsonEndpoints = require('./routes/json');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', jsonEndpoints);

// catch 404 and return error promise
app.use(function(req, res, next) {
  return Promises.handleError(req, res, Promises.makeError('page not found', Promises.statusCodes.STATUS_404))
});

module.exports = app;