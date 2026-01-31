const { created, ok } = require("../utils/response");

function authController(deps) {
  const { withTx, keys } = deps;

  return {
    register: async (req, res) => {
      const data = await withTx(async (client) =>
        deps.authSvc.register(client, keys, req, req.body),
      );
      return created(res, data);
    },
    login: async (req, res) => {
      const data = await withTx(async (client) =>
        deps.authSvc.login(client, keys, req, req.body),
      );
      return ok(res, data);
    },
    refresh: async (req, res) => {
      const data = await withTx(async (client) =>
        deps.authSvc.refresh(client, keys, req, req.body),
      );
      return ok(res, data);
    },
    logout: async (req, res) => {
      const data = await withTx(async (client) =>
        deps.authSvc.logout(client, req.body),
      );
      return ok(res, data);
    },
    me: async (req, res) => {
      const data = deps.authSvc.me(req.user);
      return ok(res, data);
    },
    jwks: async (req, res) => {
      const jwks = await deps.tokenSvc.buildJWKS(keys.publicKey);
      return res.status(200).json(jwks);
    },
  };
}

module.exports = { authController };
