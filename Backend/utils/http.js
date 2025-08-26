export const send = (res, status, data) => res.status(status).json(data);
export const ok = (res, data) => send(res, 200, data);
export const created = (res, data) => send(res, 201, data);
export const bad = (res, message) => send(res, 400, { message });
export const unauthorized = (res, message = "Unauthorized") =>
  send(res, 401, { message });
export const forbidden = (res, message = "Forbidden") =>
  send(res, 403, { message });
export const notFound = (res, message = "Not found") =>
  send(res, 404, { message });
