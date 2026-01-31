const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { errorHandler } = require("./middlewares/errorHandler");
const { authRoutes } = require("./routes/auth.routes");

function createApp(deps) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  app.use("/auth", authRoutes(deps));

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
