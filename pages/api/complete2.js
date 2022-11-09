import formidable from "formidable";
import fs from "fs";
import * as crypto from "crypto";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../../utils/connectDB";
import PdfDetails from "../../models/PdfDetailsModel";

export const config = {
  api: {
    bodyParser: true,
  },
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file);
    return res.status(201).send("");
  });
};

const generateKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      // cipher: "aes-256-cbc",
    },
  });
  // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  //   modulusLength: 2048,
  // });

  return {
    publickey: publicKey.toString("base64"),
    privatekey: privateKey,
  };
};

const writeKey = async (url, publickey, privateKey, res) => {
  // const url = file.location;
  console.log(url);
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();
  const id = uuidv4();
  console.log("write", id);
  // Draw a string of text diagonally across the first page
  firstPage.drawText(`ID=${id}`, {
    x: 5,
    y: height / 2 + 300,
    size: 5,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(0),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  let blb = new Blob([pdfBytes], { type: "application/pdf" });

  const base64String = await pdfDoc.saveAsBase64();
  //   console.log("base64 string", base64String);
  if (base64String) {
    console.log("base 64");
    var buf = Buffer.from(base64String, "utf8");
    console.log("beffer", buf);
    hashing(privateKey, buf, url, publickey, base64String, id);
    // return base64String;
  }
  // return pdfBytes;
  if (blb && base64String) {
    res.status(200).send({ blob: blb, str: base64String });
  }

  // Trigger the browser to download the PDF document
  // let blb = new Blob([pdfBytes], { type: "application/pdf" });
  // let link = window.URL.createObjectURL(blb);
};

const hashing = async (
  privateKey,
  file,
  url,
  publickey,
  signedPdfString,
  id
) => {
  console.log("hsh", id);
  //   let privatekey = crypto.createPrivateKey({
  //     key: Buffer.from(privateKey, "base64"),
  //     type: "pkcs8",
  //     format: "der",
  //     passphrase: "top secret",
  //   });

  //   console.log(privateKey);

  //   var privatekey = crypto.privateDecrypt(
  //     {
  //       key: privateKey.toString(),
  //       passphrase: "top secret",
  //     },
  //     Buffer.from(privateKey, "base64")
  //   );

  // File/Document to be signed
  //   const data = fs.readFileSync(file.filepath);
  //   console.log("path", data);

  //   fs.writeFileSync(`./public/${file.name}`, data);
  //   await fs.unlinkSync(file.filepath);

  // console.log("public key", publickey);
  // console.log("private", privateKey.toString("base64"));

  // Signing
  const signer = crypto.createSign("RSA-SHA256");
  signer.write(file);
  signer.end();

  // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
  const signature = signer.sign(privateKey, "base64");
  try {
    await connectDB();
    const test = await PdfDetails.create({
      ID: id,
      privateKey: privateKey.toString("base64"),
      publicKey: publickey,
      unsignedPdfUrl: url,
      digitalSign: signature,
      signedPdfString: signedPdfString,
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Digital Signature: ", signature);
  // res.send(signature);
  return signature;
};

const signFile = async (req, res) => {
  //   const form = new formidable.IncomingForm();
  //   form.parse(req, async function (err, fields, files) {
  //     await saveFile(files.file);
  //     return res.status(201).send("");

  //   });
  let privateKey, publicKey;

  publicKey = generateKeys().publickey;
  privateKey = generateKeys().privatekey;
  //   console.log("Private Key: ", privateKey, publicKey);
  console.log(req.body, JSON.parse(req.body));
  const url = JSON.parse(req.body).url;
  let fileBuffer = writeKey(url, publicKey, privateKey, res);

  // res.status(200).send(fileBuffer);
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.filepath);
  console.log("path", data);
  fs.writeFileSync(`./public/${file.name}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};

export default (req, res) => {
  req.method === "POST"
    ? signFile(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? res.send("Request HTTP Method invalid")
    : res.status(404).send("");
};
