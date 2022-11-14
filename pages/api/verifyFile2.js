import * as crypto from "crypto";
import connectDB from "../../utils/connectDB";
import PdfDetails from "../../models/PdfDetailsModel";
import formidable from "formidable";
import fs from "fs";
import { text } from "express";
const { PdfReader } = require("pdfreader");

const pdf = require("pdf-parse");

export const config = {
  api: {
    bodyParser: false,
  },
};

const verifySign = (doc, pdfBuffer) => {
  const details = doc[0];

  let { digitalSign, privateKey, ID, signedPdfString, publicKey } = details;

  var buf;
  if (pdfBuffer.toString("base64") === signedPdfString) {
    buf = Buffer.from(signedPdfString);
  }

  let privatekey = crypto.createPrivateKey(privateKey);

  const verify = crypto.createVerify("SHA256");
  verify.update(pdfBuffer.toString("base64"));
  verify.end();
  let result = verify.verify(privatekey, Buffer.from(digitalSign, "base64"));
  console.log("result", result);

  return result;

  // const signer = crypto.createSign("RSA-SHA256");
  // signer.write(buf);
  // signer.end();

  // // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
  // const signature = signer.sign(privatekey, "base64");

  // if (signature === digitalSign) {
  //   console.log(true);
  //   return true;
  // } else {
  //   conosle.log(false);
  // }
  // return false;
};

const verify = (req, res) => {
  const form = new formidable.IncomingForm({ keepExtensions: true });
  form.parse(req, async function (err, fields, files) {
    if (files.file == null) {
      res.status(200).json({ error: "Please, select atleast one file !!" });
    } else {
      const promise = new Promise(function (resolve, reject) {
        fs.readFile(files.file.filepath, (err, pdfBuffer) => {
          if (err) reject();
          if (!err && pdfBuffer) {
            let is_verified = false;
            var timeout = setTimeout(() => {
              if (is_verified) {
                resolve();
              } else {
                reject();
              }
            }, 5000);
            new PdfReader().parseBuffer(pdfBuffer, async (err, item) => {
              if (item && item.text !== undefined && item.text.includes("ID")) {
                let key = item.text.replace("ID=", "");
                connectDB();
                const doc = await PdfDetails.find({
                  ID: key,
                });
                let result = verifySign(doc, pdfBuffer);
                if (result) {
                  clearTimeout(timeout);
                  resolve();
                }
                // PdfDetails.findOne({ ID: key }, (err, data) => {
                //   if (data !== null && data.ID !== undefined) {
                //     clearTimeout(timeout);
                //     resolve();
                //   }
                // });
              }
            });
          } else {
            reject();
          }
        });
      });
      promise
        .then(function () {
          res.status(200).json({ verified: true });
        })
        .catch(function () {
          res.status(200).json({ verified: false });
        });
    }
  });
  return;
};

export default function handler(req, res) {
  if (req.method === "POST") {
    verify(req, res);
  } else {
    res.status(404).json({ message: "Request HTTP Method Incorrect." });
  }
}
