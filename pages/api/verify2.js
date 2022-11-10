import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
const { PdfReader } = require("pdfreader");
const { DownloaderHelper } = require("node-downloader-helper");
import fs from "fs";
// var pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");

const verifyFile = async (req, res) => {
  console.log(req.body);
  const url = JSON.parse(req.body).url;
  // const url = req.body.url;
  getBuffer(url);
  const dl = new DownloaderHelper(url, "public/");
  dl.on("end", () => {
    console.log("Download Completed");
    const dat = fs.readFileSync("public/sample.pdf");
    console.log(dat);
  });
  dl.on("error", (err) => console.log("Download Failed", err));
  dl.start().catch((err) => console.error(err));
  // let fileBuffer = writeKey(url, publicKey, privateKey, res);

  // res.status(200).send(fileBuffer);
};

const getBuffer = async (url) => {
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const base64String = await pdfDoc.saveAsBase64();
  var pdfBuffer = Buffer.from(base64String, "utf8");
  // new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
  //   if (err) console.error("error:", err);
  //   else if (!item) console.warn("end of buffer");
  //   else if (item.text) {
  //     console.log(item.text);
  //     if (item.text.includes("ID")) {
  //       // getDoc(item.text, data, res);
  //       // console.log(item.text);
  //     } else {
  //       // res.send({ message: "Pdf not Found" });
  //     }
  //   }
  // });
};

export default (req, res) => {
  req.method === "POST"
    ? verifyFile(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? res.send("Request HTTP Method invalid")
    : res.status(404).send("");
};
