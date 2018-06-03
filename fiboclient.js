let http = require('http');
let util = require('util');
[
  "/fibonacci/30",
  "/fibonacci/20",
  "/fibonacci/10",
  "/fibonacci/9",
  "/fibonacci/8",
  "/fibonacci/7",
  "/fibonacci/6",
  "/fibonacci/5",
  "/fibonacci/4"
].forEach(path => {
  let req =  http.request({
    host: "localhost",
    port: 3000,
    path: path,
    method: 'GET'
  }, function (res) {
    res.on('data', function (chunk) {
      util.log('BODY :' + chunk);
    })
  });
  req.end();
});