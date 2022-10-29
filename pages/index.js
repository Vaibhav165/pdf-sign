import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Fragment, useState, useEffect, useRef, useContext } from "react";

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
    bucketName: "freelance-project-1-bucket",
    dirName: "pdfs",
    region: "ap-south-1",
    accessKeyId: "AKIAYOFF7FFAJRUIMBQM",
    secretAccessKey: "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",
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
    console.log("uploaded");

    S3Client.uploadFile(e.target.files[0])
      .then((data) => {
        console.log(data);
        setFile(data);
      })
      .catch((err) => console.error(err));
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
                    <Link href="sign">
                      <Button variant="contained">Sign it</Button>
                    </Link>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
