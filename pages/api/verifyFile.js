import * as crypto from "crypto";
import connectDB from "../../utils/connectDB";
import PdfDetails from "../../models/PdfDetailsModel";
import formidable from "formidable";
import fs from "fs";
const { PdfReader } = require("pdfreader");

const pdf = require("pdf-parse");

export const config = {
  api: {
    bodyParser: false,
  },
};

const verifySign = (doc, pdfBuffer, res) => {
  const details = doc[0];

  let { publicKey, digitalSign } = details;

  // let publickey = crypto.createPublickey({
  //   key: publicKey,
  //   type: "spki",
  //   format: "der",
  // });
  let publickey = crypto.createPublicKey(publicKey);

  const verify = crypto.createVerify("SHA256");
  verify.update(pdfBuffer);
  verify.end();
  let result = verify.verify(publickey, Buffer.from(digitalSign, "base64"));

  res.status(200).send({ verify: result });
};

const getDoc = async (id, pdfBuffer, res) => {
  // try {
  await connectDB();
  const doc = await PdfDetails.find({ ID: id.replace("ID=", "") });
  // } catch (e) {
  //   console.log(e);
  // }

  verifySign(doc, pdfBuffer, res);
};

const verify = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file, res);
    // return res.status(201).send("");
  });
};

const saveFile = async (file, res) => {
  const data = fs.readFileSync(file.filepath);
  fs.readFile(file.filepath, (err, pdfBuffer) => {
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) console.error("error:", err);
      else if (!item) console.warn("end of buffer");
      else if (item.text) {
        if (item.text.includes("ID")) {
          getDoc(item.text, data, res);
          // console.log(item.text);
        }
      }
    });
  });

  fs.writeFileSync(`./public/${file.name}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};

export default (req, res) => {
  req.method === "POST"
    ? verify(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? res.send("Request HTTP Method invalid")
    : res.status(404).send("");
};
