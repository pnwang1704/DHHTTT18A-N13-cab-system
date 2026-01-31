const { env } = require("./config/env");
const { loadKeys } = require("./config/jwt");
const { withTx } = require("./config/db");

const authSvc = require("./services/auth.service");
const tokenSvc = require("./services/token.service");
const { authMiddleware } = require("./middlewares/jwt.middleware");
const { authController } = require("./controllers/auth.controller");
const { createApp } = require("./app");

async function main() {
  const keys = loadKeys();

  const deps = {
    withTx,
    keys,
    authSvc,
    tokenSvc,
    authMiddleware: authMiddleware(keys.publicKey),
  };

  deps.controller = authController(deps);

  const app = createApp(deps);

  app.listen(env.port, () => {
    console.log(`[auth-service] listening on :${env.port} (${env.nodeEnv})`);
  });
}

main().catch((e) => {
  console.error("[auth-service] fatal error", e);
  process.exit(1);
});
