const CreateSuccessResponse = function (res, status, data) {
  return res.status(status).send({ success: true, data: data });
};

const CreateErrorResponse = function (res, status, message) {
  return res.status(status).send({ success: false, message });
};

const CreateCookieResponse = function (res, key, value, exp) {
  res.cookie(key, value, {
    httpOnly: true,
    expires: new Date(exp),
    signed: true,
  });
};

module.exports = {
  CreateSuccessResponse,
  CreateErrorResponse,
  CreateCookieResponse,
};
