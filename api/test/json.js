const dummyBlob = require('./utils/dummyBlob');
const testCases = require('./utils/testCases')

let id = null;
const statusCodes = {
  STATUS_200: 200, 
  STATUS_400: 400, 
  STATUS_404: 404,
  STATUS_500: 500
}

describe("JSON Blob Management API", function() {

  describe("Submit blob and perform various flavors of read operations", function() {

    const options = {
      method: 'POST',
      url: 'http://localhost:3500/json/submit',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(dummyBlob.content),
      qs: {
        key: 'test1'
      }
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_200, (body) => {
      id = body
    })
  });

  describe("Read blob by key", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/read-by-key',
      qs: {
        key: 'test1'
      }
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_200)
  });

  describe("Read blob by id", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/read-by-tuple',
      // request is missing id so this should return a 400
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_400)
  });

  describe("Read blob html by key", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-key',
      qs: {
        key: 'test1',
        attr: 'html'
      }
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_200)
  });

  describe("Read blob links by key", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-key',
      qs: {
        key: 'test1',
        attr: 'links'
      }
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_200)
  });

  describe("Read blob resources by key", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-key',
      qs: {
        key: 'test1',
        attr: 'resources'
      }
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_200)
  });

  describe("Read blob html by id", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-tuple',
      // request is missing id and attr so this should return a 400
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_400)
  });

  describe("Read blob links by id", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-tuple',
      // request is missing id and attr so this should return a 400
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_400)
  });

  describe("Read blob resources by id", function() {

    const options = {
      method: 'GET',
      url: 'http://localhost:3500/json/chunk/read-by-tuple',
      // request is missing id and attr so this should return a 400
    };
    
    testCases.checkForStatus(options, statusCodes.STATUS_400)
  });

});