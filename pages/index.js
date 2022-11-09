import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Fragment, useState, useEffect, useRef, useContext } from "react";

import axios, * as others from "axios";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
// import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import FileContext from "../src/Context/FileContext";

import NavBar from "../components/NavBar";

import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import S3 from "aws-s3";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import WebViewer from "@pdftron/pdfjs-express-viewer";

// Styled component for the upload image inside the dropzone area
const Img = styled("img")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginRight: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    width: 250,
  },
}));

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

export default function Home() {
  // ** State
  const [files, setFiles] = useState([]);

  const [file, setFile] = useContext(FileContext);

  const config = {
    bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET,
    dirName: "pdfs",
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    /* optional */
  };

  const S3Client = new S3(config);

  // ** Hook
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
      if (files.length > 0) {
        console.log("now");
      }
    },
  });

  const [selectedFile, setSelectedFile] = useState();

  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log("uploaded", e.target.files);

    // S3Client.uploadFile(e.target.files[0])
    //   .then((data) => {
    //     console.log(data);
    //     setFile(data);
    //     // writeToDoc(data);
    //   })
    //   .catch((err) => console.error(err));

    if (file) {
      console.log("file", file);
    }
  };

  const handleLinkClick = (event) => {
    event.preventDefault();

    // S3Client.uploadFile(files)
  };
  const img = files.map((file) => (
    <img
      key={file.name}
      alt={file.name}
      className="single-file-image"
      src={URL.createObjectURL(file)}
    />
  ));

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const [keys, setKeys] = useState(null);

  async function writeToDoc(data) {
    const url =
      "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf";
    // const url = file.location;
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

    // Draw a string of text diagonally across the first page
    firstPage.drawText(data.publickey, {
      x: 5,
      y: height / 2 + 300,
      size: 5,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(0),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    let blb = new Blob([pdfBytes], { type: "application/pdf" });
    let link = window.URL.createObjectURL(blb);
    window.open(link, "_blank");
    // download(pdfBytes, "pdf-lib_modification_example.pdf");
  }

  async function signDOC() {
    fetch("/api/generateKeys")
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        setKeys(res);
        console.log("keys", keys);
        if (file) {
          writeToDoc(res);
        }
      });
  }

  return (
    <Fragment>
      <Grid container spacing={12}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            padding: "20px 0",
            backgroundColor: "#fff",
            marginTop: "20px",
          }}
        >
          <NavBar />
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card sx={{ width: "70%", margin: "0 auto" }}>
                <CardContent>
                  <Grid
                    container
                    spacing={6}
                    sx={{ display: "grid", justifyContent: "center" }}
                  >
                    <Grid item xs={12} md={12}>
                      <h2>Sign a PDF</h2>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <input type="file" onChange={handleChange} />
                      {/* <form
                        action="/api/file3"
                        enctype="multipart/form-data"
                        method="POST"
                      >
                        <span>Upload Profile Picture:</span>
                        <input type="file" name="mypic" required /> <br />
                        <input type="submit" value="submit" />
                      </form> */}

                      {/* <Box
                        {...getRootProps({ className: "dropzone" })}
                        sx={acceptedFiles.length ? { height: 450 } : {}}
                      >
                        <input {...getInputProps()} />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: ["column", "column", "row"],
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              textAlign: ["center", "center", "inherit"],
                            }}
                          >
                            <HeadingTypography variant="h5">
                              Drop files here or click to upload.
                            </HeadingTypography>
                            <Link href="/" onClick={handleLinkClick}>
                              <Button
                                onClick={handleLinkClick}
                                variant="contained"
                              >
                                Upload PDF
                              </Button>
                            </Link>
                          </Box>
                        </Box>
                        {files.length ? img : null}
                      </Box> */}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  {file && (
                    <Document
                      file={
                        file
                          ? file.location
                          : "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
                      }
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page height={300} width={300} pageNumber={pageNumber} />
                    </Document>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {file ? (
                    // <Link href="sign">
                    <Button onClick={signDOC} variant="contained">
                      Sign and download it
                    </Button>
                  ) : // </Link>
                  null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
