const crypto = require("crypto");

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomTokenBase64Url(bytes = 48) {
  // base64url without padding
  return crypto.randomBytes(bytes).toString("base64url");
}

module.exports = { sha256Hex, randomTokenBase64Url };
