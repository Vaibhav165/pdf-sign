const https = require("https");
var AWS = require("aws-sdk");

export default function handler(req, res) {
  //   let myURL = new URL(
  //     "/ns/oa",
  //     "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
  //   );
  //   let body = [];
  //   https
  //     .request(myURL, (res) => {
  //       // XXX verify HTTP 200 response
  //       res.on("data", (chunk) => body.push(chunk));
  //       res.on("end", () => console.log(Buffer.concat(body).toString()));
  //     })
  //     .end();

  //   res.status(200).json({ name: "John Doe" });

  //   const s3 = new AWS.S3({
  //     accessKeyId: 'AKIAYOFF7FFANAIG2HFG' /* required */,
  //     secretAccessKey: '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' /* required */,
  //     Bucket: 'freelance-project-1-bucket' /* required */,
  //   });

  //   const params = {
  //     Bucket: 'freelance-project-1-bucket' /* required */,
  //     Key: fileName,
  //   }; /* required */

  //   const s3download = function (params) {
  //     return new Promise((resolve, reject) => {
  //       s3.createBucket(
  //         {
  //           Bucket: 'freelance-project-1-bucket' /* Put your bucket name */,
  //         },
  //         function () {
  //           s3.getObject(params, function (err, data) {
  //             if (err) {
  //               reject(err);
  //             } else {
  //               console.log("Successfully dowloaded data from  bucket");
  //               resolve(data);
  //             }
  //           });
  //         }
  //       );
  //     });
  //   };

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const params = { Bucket: "downloads", Key: "demo-annotated" };
  const file = require("fs").createWriteStream(
    "/Users/vaibhavbansal/pdf-signer/pages/api/demo.pdf"
  );
  s3.getObject(params).createReadStream().pipe(file);
}
