function ok(res, data, meta) {
  return res.status(200).json({ data, meta });
}

function created(res, data, meta) {
  return res.status(201).json({ data, meta });
}

function fail(res, status, code, message, details) {
  return res.status(status).json({ error: { code, message, details } });
}

module.exports = { ok, created, fail };
