import * as crypto from "crypto";
import connectDB from "../../utils/connectDB";
import PdfDetails from "../../models/PdfDetailsModel";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import formidable from "formidable";
import fs from "fs";
const { PdfReader } = require("pdfreader");
import { jsPDF } from "jspdf";
const pdf = require("pdf-parse");

export const config = {
  api: {
    bodyParser: false,
  },
};

const modify = async (pdfData, res) => {
  // console.log(pdfData.toString());

  // const PDFdoc = await PDFDocument.load(pdfData);

  // PDFdoc.setTitle("Letter");
  // PDFdoc.setAuthor("Jane Doe");
  // PDFdoc.setSubject("pdf-lib example");
  // PDFdoc.setCreationDate(new Date());
  // PDFdoc.setModificationDate(new Date());

  // console.log(`Title: ${PDFdoc.getTitle()}`);
  // console.log(`Author: ${PDFdoc.getAuthor()}`);
  // console.log(`Subject: ${PDFdoc.getSubject()}`);
  // console.log(`Creation Date: ${PDFdoc.getCreationDate()}`);
  // console.log(`Modification date: ${PDFdoc.getModificationDate()}`);

  // const pdfBytes = await PDFdoc.save();

  pdf(pdfData).then(function (data) {
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    // console.log(data.numrender);
    // PDF info
    // console.log(data.info);
    // PDF metadata
    // console.log(data.metadata);
    // PDF.js version
    // console.log(data.version);
    // PDF text
    // if (data.text.includes("ID")) {
    //   console.log("this is id", data.text);
    // }
    // console.log(data.text);
    // console.log(data.text.toString());
    // console.log(bufferFromBufferString(pdfData));
    // function bufferFromBufferString(bufferStr) {
    //   return Buffer.from(
    //     bufferStr
    //       .replace(/[<>]/g, "") // remove < > symbols from str
    //       .split(" ") // create an array splitting it by space
    //       .slice(1) // remove Buffer word from an array
    //       .reduce((acc, val) => acc.concat(parseInt(val, 16)), []) // convert all strings of numbers to hex numbers
    //   );
    // }
  });
};

const verifySign = (doc, pdfBuffer, res) => {
  const details = doc[0];

  let { publicKey, digitalSign, privateKey } = details;
  // let privatekey = crypto.createPrivateKey({
  //   key: Buffer.from(privateKey, "base64"),
  //   type: "pkcs8",
  //   format: "pem",
  // });
  // console.log(privatekey);
  console.log(Buffer.from(publicKey, "base64"));
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
  console.log("result", result);
  res.status(200).send({ verify: result });
};

const getDoc = async (id, pdfBuffer, res) => {
  console.log(id);
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
  // let { url } = req.body;
  // await connectDB();
  // const pdf = await pdf.find({ url: url });
};

const saveFile = async (file, res) => {
  const data = fs.readFileSync(file.filepath);
  // console.log("path", data);
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
  modify(data, res);
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
