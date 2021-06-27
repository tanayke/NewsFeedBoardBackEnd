const createResult = (error, data) => {
  return error ? createError(error) : createSuccess(data);
};

const createSuccess = (data) => {
  const result = {};
  result.status = 'success';
  result.data = data;
  return result;
};

const createError = (error) => {
  const result = {};
  result.status = 'error';
  result.error = error;
  return result;
};

module.exports = {
  createResult,
  createSuccess,
  createError,
};
