class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
module.exports = { ValidationError, AppError };
