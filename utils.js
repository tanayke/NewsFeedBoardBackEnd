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
const createResult = (error, data) =>
  error ? createError(error) : createSuccess(data);

module.exports = {
  createResult,
  createSuccess,
  createError,
};
