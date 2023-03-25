export class HttpError extends Error {
  constructor(code, message) {
    super(code === 400 ? `Bad Request - ${message}` : message);
    this.code = code;
  }
}

export default HttpError;