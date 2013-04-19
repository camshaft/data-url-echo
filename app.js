/**
 * Module exports
 */
var connect = require("connect");

/**
 * Expose the app
 */
var app = module.exports = connect();

var regex = /^data:([a-z]+\/([a-z]+));base64,(.+)/;

app.use(require("connect-metric")(null, {request_id: "heroku-request-id"}));
app.use(function(req, res, next) {
  req.done = req.metric.profile("parse-time");
  next();
});
app.use(connect.middleware.bodyParser({limit: "5mb"}));
/**
 * Stream the image back to the browser
 */
app.use(function streamer(req, res, next) {
  if(req.method !== "POST") return next();

  var result = regex.exec(req.body.i);

  if(!result) return res.end("invalid image");

  res.setHeader("content-type", result[1]);
  res.setHeader('content-disposition', 'attachment; filename=image.'+result[2]);

  var image = new Buffer(result[3], 'base64');
  res.write(image);
  res.end();
  req.done()
});
