import crypto from "crypto";

export default function handler(req, res) {
  const { publickey, privatekey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "der",
    },
  });

  res.send({
    publickey: publickey.toString("base64"),
    privatekey: privatekey.toString(" base64"),
  });
}
