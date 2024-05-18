import asyncHandler from "express-async-handler";
import Notice from "../model/noticeShema.js";
import {
  fileDataDeleteFromCloud,
  fileUploadToCloud,
} from "../utils/cloudinary.js";
import { findPublicId } from "../helper/Helper.js";

//create Notice
export const createNotice = asyncHandler(async (req, res) => {
  const { title, text, photo } = req.body;

  //check photo
  let fileData = null;

  if (req.file) {
    const data = await fileUploadToCloud(req.file.path);
    fileData = data.secure_url;
  }

  const data = await Notice.create({
    title,
    text,
    photo: fileData,
  });

  res
    .status(200)
    .json({ notice: data, message: "New Notice created successfull" });
});

//create Notice
export const singleNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Notice.findById(id);

  res.status(200).json({ notic: data });
});

/**
 *
 * @description Get all Notice
 * @method GET
 * @route api/v1/notice
 * @access public
 */
export const getAllNotice = asyncHandler(async (req, res) => {
  const data = await Notice.find();

  res.status(200).json({ notices: data });
});

/**
 *
 * @description Delete Notice
 * @method DELETE
 * @route api/v1/course
 * @access public
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const delData = await Notice.findByIdAndDelete(id);

  await fileDataDeleteFromCloud(findPublicId(delData?.photo));

  res.status(200).json({ delData, message: "Delete Notice successfull" });
});
