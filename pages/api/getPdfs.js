import connectDB from "../../utils/connectDB";
import PdfDetails from "../../models/PdfDetailsModel";

export default async (req, res) => {
  try {
    await connectDB();
    const pdfs = await PdfDetails.find({});
    switch (req.method) {
      case "GET":
        return res.status(200).json(pdfs);
      default:
        return res
          .status(404)
          .json({ message: "Request HTTP Method Incorrect." });
    }
  } catch (err) {
    console.log(err);
  }
};
