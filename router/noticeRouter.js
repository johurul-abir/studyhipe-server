import express from "express";
import {
  createNotice,
  deleteNotice,
  getAllNotice,
  singleNotice,
} from "../controler/noticeControler.js";
import { noticeMulter } from "../utils/multer.js";

const router = express.Router();
router.post("/", noticeMulter, createNotice);
router.get("/", getAllNotice);
router.get("/:id", singleNotice);
router.delete("/:id", deleteNotice);

//export default
export default router;
