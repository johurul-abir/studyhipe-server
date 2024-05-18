import asyncHandler from "express-async-handler";
import Teacher from "../model/teacherSchema.js";
import {
  fileDataDeleteFromCloud,
  fileUploadToCloud,
} from "../utils/cloudinary.js";
import { findPublicId } from "../helper/Helper.js";

/**
 *
 * @description Get all Teachers
 * @method Get
 * @route api/v1/teacher
 * @access private
 */

export const getAllTeacher = asyncHandler(async (req, res) => {
  const data = await Teacher.find();

  res
    .status(200)
    .json({ teachers: data, message: "Get all teachers successfull" });
});

/**
 *
 * @description Delete Student
 * @method DELETE
 * @route api/v1/student
 * @access public
 */
export const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const delData = await Teacher.findByIdAndDelete(id);

  await fileDataDeleteFromCloud(findPublicId(delData?.photo));

  res.status(200).json({ delData, message: "student delete successfull" });
});

/**
 *
 * @description Create Teacher
 * @method POST
 * @route api/v1/teacher
 * @access private
 */

export const createTeacher = asyncHandler(async (req, res) => {
  //get student data
  const { name, phone, email, subject } = req.body;

  //check photo
  let fileData = null;
  if (req.file) {
    const data = await fileUploadToCloud(req.file.path);
    fileData = data.secure_url;
  }

  const data = await Teacher.create({
    name,
    phone,
    email,
    subject,
    photo: fileData,
  });

  res.status(200).json({
    teacher: data,
    message: "New teacher create successfull",
  });
});
