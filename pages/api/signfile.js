const crypto = require("crypto");
const fs = require("fs");

export default function handler(req, res, next) {
  //   const { private_key } = req.body;
  const private_key = fs.readFileSync(
    "/Users/vaibhavbansal/pdf-signer/pages/api/privatekey.pem"
  );

  //   let privatekey = crypto.createPrivateKey({
  //     key: Buffer.from(private_key, "base64"),
  //     type: "pkcs8",
  //     format: "der",
  //   });

  // File/Document to be signed
  //   const doc = fs.readFileSync("../../public/demo.pdf");
  const doc = fs.readFileSync(
    "/Users/vaibhavbansal/pdf-signer/pages/api/demo.pdf"
  );
  // Signing
  const signer = crypto.createSign("RSA-SHA256");
  signer.write(doc);
  signer.end();

  // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
  const signature = signer.sign(private_key, "base64");

  console.log("Digital Signature: ", signature);
  res.send(signature);
}
