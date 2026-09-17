/**
 * Express 5 compatible HTTP Parameter Pollution (HPP) Middleware
 * Cleans duplicated query parameters and body fields by selecting the last parameter value.
 */

function hpp(options = {}) {
  const whitelist = Array.isArray(options.whitelist) ? options.whitelist : [];

  return (req, res, next) => {
    // Sanitize req.query (Express 5 safe: mutate properties without reassigning req.query object)
    if (req.query && typeof req.query === 'object') {
      for (const key of Object.keys(req.query)) {
        if (Array.isArray(req.query[key]) && !whitelist.includes(key)) {
          req.query[key] = req.query[key][req.query[key].length - 1];
        }
      }
    }

    // Sanitize req.body
    if (req.body && typeof req.body === 'object' && !req.is('json')) {
      for (const key of Object.keys(req.body)) {
        if (Array.isArray(req.body[key]) && !whitelist.includes(key)) {
          req.body[key] = req.body[key][req.body[key].length - 1];
        }
      }
    }

    next();
  };
}

module.exports = hpp;
