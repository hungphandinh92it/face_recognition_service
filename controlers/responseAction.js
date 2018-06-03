exports.success = (res, docs, code = 200) => {
  console.log("Success", docs);
  res.status(code).json({success: true, data: docs});
};

exports.error = (res, err, code = 400) => {
  console.log('Error', err);
  return res.status(code).json(err);
};