import { Schema, model, models } from "mongoose";
const mongoose = require("mongoose");

const PdfDetailsSchema = new Schema({
  ID: { type: String, required: true },
  privateKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  unsignedPdfUrl: {
    type: String,
    required: true,
  },
  digitalSign: String,
  signedPdfString: {
    type: String,
    required: true,
  },
  name: String,
});

// const PdfDetails = models.PdfDetails || model("Pdf Details", PdfDetailsSchema);
let PdfDetails;
export default mongoose.models.PdfDetails ||
  mongoose.model("PdfDetails", PdfDetailsSchema);
// export default mongoose.models.PdfDetails ||
//   mongoose.model("Pdf Details", PdfDetailsSchema);

// export default PdfDetails;
