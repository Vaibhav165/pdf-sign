import { useEffect, useRef, useState, useContext } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import NavBar from "../components/NavBar";

import FileContext from "../src/Context/FileContext";

import { Document, pdfjs, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Sign() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [file, setFile] = useContext(FileContext);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  console.log(file);
  const viewer = useRef(null);

  //   useEffect(() => {
  //     import("@pdftron/webviewer").then(() => {
  //       WebViewer(
  //         {
  //           path: "/lib",
  //           initialDoc:
  //             "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
  //         },
  //         viewer.current
  //       ).then((instance) => {
  //         const { docViewer } = instance;
  //         // you can now call WebViewer APIs here...
  //       });
  //     });
  //   }, []);

  return (
    <div className="MyComponent">
      {/* <Document
        file={
          "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
        }
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document> */}
      <Grid container spacing={6}>
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
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Grid container spacing={6}>
                    <Grid item>
                      <TextField
                        label="Name"
                        placeholder="John Doe"
                        id="form-props-full-width"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Email"
                        placeholder="john@doe.com"
                        id="form-props-full-width"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={9}>
              <iframe
                style={{ width: "95%", minHeight: "100vh" }}
                src={
                  file
                    ? file.location
                    : "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
                }
              ></iframe>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <div className="header">Sample</div>
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div> */}
    </div>
  );
}
