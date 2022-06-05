exports.sendError = function sendError(res, err) {
  res.status(500);
  res.send(err);
}

exports.sendSuccess = function sendSuccess(res, msg) {
  res.status(200);
  res.send(msg);
}