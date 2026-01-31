const fs = require("fs");
const { createPublicKey, createPrivateKey } = require("crypto");
const { env } = require("./env");

function loadKeys() {
  const privPem = fs.readFileSync(env.jwt.privateKeyPath, "utf8");
  const pubPem = fs.readFileSync(env.jwt.publicKeyPath, "utf8");

  const privateKey = createPrivateKey(privPem);
  const publicKey = createPublicKey(pubPem);

  return { privateKey, publicKey, pubPem };
}

module.exports = { loadKeys };
