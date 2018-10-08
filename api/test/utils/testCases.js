var expect  = require("chai").expect;
var request = require("request");

module.exports.checkForStatus = (options, statusCode) => {
  it("returns status " + statusCode, function(done) {
    request(options, function(error, res, body) {
      expect(res.statusCode).to.equal(statusCode);
      done();
    });
  });
}