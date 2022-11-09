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

  let { digitalSign, privateKey, ID, signedPdfString } = details;

  // let publickey = crypto.createPublickey({
  //   key: publicKey,
  //   type: "spki",
  // });

  var buf;
  if (pdfBuffer.toString("base64") === signedPdfString) {
    buf = Buffer.from(signedPdfString);
  }

  let privatekey = crypto.createPrivateKey(privateKey);
  // const sign = crypto.sign("SHA256", pdfBuffer, privatekey);

  const signer = crypto.createSign("RSA-SHA256");
  signer.write(buf);
  signer.end();

  // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
  const signature = signer.sign(privatekey, "base64");

  if (signature === digitalSign) {
    console.log(true);
    res.status(200).send({ verify: true });
  } else {
    res.status(200).send({ verify: false });
    console.log(false);
  }

  // const verify = crypto.createVerify("SHA256");
  // verify.update(buf);
  // verify.end();
  // let result = verify.verify(publickey, Buffer.from(digitalSign, "base64"));
  // console.log(result);
};

const getDoc = async (id, pdfBuffer, res) => {
  // try {
  await connectDB();
  const doc = await PdfDetails.find({ ID: id.replace("ID=", "") });
  // } catch (e) {
  //   console.log(e);
  // }

  if (doc.length) {
    verifySign(doc, pdfBuffer, res);
  } else {
    res.send({ message: "Pdf not Found" });
  }
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
  // console.log(data);
  fs.readFile(file.filepath, (err, pdfBuffer) => {
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) console.error("error:", err);
      else if (!item) console.warn("end of buffer");
      else if (item.text) {
        if (item.text.includes("ID")) {
          getDoc(item.text, data, res);
          // console.log(item.text);
        } else {
          // res.send({ message: "Pdf not Found" });
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
    ? res.status(404).json({ message: "Request HTTP Method Incorrect." })
    : req.method === "DELETE"
    ? res.status(404).json({ message: "Request HTTP Method Incorrect." })
    : req.method === "GET"
    ? res.send("Request HTTP Method invalid")
    : res.status(404).send("");
};
