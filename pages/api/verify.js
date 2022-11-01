import crypto from "crypto";

export default function handler(req, res) {
  let { data, publicKey, signature } = req.body;
  publickey = crypto.createPublickey({
    key: Buffer.from(publicKey, "base64"),
    type: "spki",
    format: "deri",
  });
  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();
  let result = verify.verify(publickey, Buffer.from(signature, "base64"));
  res.send({ verify: result });
}
