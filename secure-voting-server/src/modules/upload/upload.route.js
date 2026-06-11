import express from "express";

import upload from "../../middleware/upload.middleware.js";

import controller from "./upload.controller.js";

const router = express.Router();

router.post(
  "/pinata",
  upload.single("file"),
  controller.uploadImage
);

export default router;