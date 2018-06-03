let math = require('./math');
let express = require('express');
let app = express();
app.get('/fibonacci/:n', (req, res, next) => {
  let result = math.fibonacci(req.params.n);
  res.send({
    n: req.params.n,
    res: result
  });
});
app.listen(3000);