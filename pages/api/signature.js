import crypto from "crypto";

export default function handler(req, res, next) {
  let data = req.body.data;
  let privateKey = req.body.privateKey;
  privatekey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, "base64"),
    type: "pkcs8",
    format: "der",
  });
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();
  const signature = sign.sign(privatekey).toString("base64");
  res.send({ data, signature });
}
