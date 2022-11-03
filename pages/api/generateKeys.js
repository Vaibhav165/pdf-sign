// import * as crypto from "crypto";
let crypto;
try {
  crypto = require("node:crypto");
} catch (err) {
  console.log("crypto support is disabled!");
}

export default function handler(req, res) {
  //   const { publickey, privatekey } = crypto.generateKeyPairSync("rsa", {
  //     modulusLength: 2048,
  //     publicKeyEncoding: {
  //       type: "spki",
  //       format: "der",
  //     },
  //     privateKeyEncoding: {
  //       type: "pkcs8",
  //       format: "der",
  //     },
  //   });

  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "top secret",
    },
  });

  res.send({
    publickey: publicKey.toString("base64"),
    privatekey: privateKey.toString(" base64"),
  });
}
