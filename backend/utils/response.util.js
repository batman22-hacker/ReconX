exports.success = (res, data, message = "Success") => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.error = (res, message = "Error", code = 500) => {
  return res.status(code).json({
    status: "error",
    message,
  });
};