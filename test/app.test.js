/**
 * Module dependencies
 */
var should = require("should")
  , supertest = require("supertest")
  , app = require("../app")
  , fs = require("fs");

describe("base64-streamer", function(){

  before(function() {
    this.image = fs.readFileSync(__dirname+"/image.base64", "utf8");
    this.expected = fs.readFileSync(__dirname+"/image.png");
  });

  it("should work", function(done) {
    var expected = this.expected;
    supertest(app)
      .post("/")
      .send("i="+encodeURIComponent(this.image))
      .buffer(false)
      .end(function(err, res) {
        if(err) done(err);
        var buffer = [];
        res.on('data', function(data) {
          buffer.push(data);
        });
        res.on('end', function() {
          var got = Buffer.concat(buffer);
          expected.should.eql(got);
          done();
        });
      });
    
  });
});
