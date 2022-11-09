const crypto = require("crypto");
const fs = require("fs");

import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res, next) {
  //   const { private_key } = req.body;
  if (req.method === "POST") {
    await runMiddleware(req, res, next);
    const { privateKey, filePath } = req.body;

    //private key can also be read from path
    // const private_key = fs.readFileSync(privateKeyPath)

    let privatekey = crypto.createPrivateKey({
      key: Buffer.from(privateKey, "base64"),
      type: "pkcs8",
      format: "der",
    });

    // File/Document to be signed
    const doc = fs.readFileSync(filePath);

    // Signing
    const signer = crypto.createSign("RSA-SHA256");
    signer.write(doc);
    signer.end();

    // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
    const signature = signer.sign(private_key, "base64");

    console.log("Digital Signature: ", signature);
    res.send(signature);
  } else {
    res.send("Request HTTP Method Incorrect.");
  }
}
