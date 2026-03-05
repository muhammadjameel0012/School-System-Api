/**
 * Unified API response format:
 * { status: boolean, statusCode: number, message: string, data: object | array }
 * All _id fields are converted to id for frontend consumption.
 */

/**
 * Recursively transforms _id to id in plain objects and arrays.
 * Applied globally so frontend always receives id instead of _id.
 */
function mapIdToFrontend(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(mapIdToFrontend);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      if (key === '_id') out.id = value[key];
      else out[key] = mapIdToFrontend(value[key]);
    }
    return out;
  }
  return value;
}

function serialize(payload) {
  return mapIdToFrontend(JSON.parse(JSON.stringify(payload)));
}

const sendSuccess = (res, statusCode, message, data = null) => {
  const payload = {
    status: true,
    statusCode,
    message: message || 'Success',
    data: data !== undefined && data !== null ? data : null,
  };
  res.status(statusCode).json(serialize(payload));
};

const sendError = (res, statusCode, message, data = null) => {
  const payload = {
    status: false,
    statusCode,
    message: message || 'An error occurred',
    data: data !== undefined && data !== null ? data : null,
  };
  res.status(statusCode).json(serialize(payload));
};

module.exports = {
  sendSuccess,
  sendError,
};
