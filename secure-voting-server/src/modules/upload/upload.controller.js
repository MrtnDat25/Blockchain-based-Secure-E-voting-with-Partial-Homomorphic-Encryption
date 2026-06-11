import uploadService from "./upload.service.js";

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const result =
      await uploadService.uploadToPinata(
        req.file
      );

    return res.status(200).json({
      status: "success",
      cid: result.cid,
      url: result.url,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export default {
  uploadImage,
};