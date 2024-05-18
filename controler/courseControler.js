import Course from "../model/courseSchema.js";
import asyncHandler from "express-async-handler";
import { findPublicId } from "../helper/Helper.js";
import {
  fileDataDeleteFromCloud,
  fileUploadToCloud,
} from "../utils/cloudinary.js";

/**
 *
 * @description Get all Course
 * @method GET
 * @route api/v1/course
 * @access public
 */
export const getAllCourse = asyncHandler(async (req, res) => {
  const data = await Course.find();

  res.status(200).json({ courses: data });
});

/**
 *
 * @description Delete Course
 * @method DELETE
 * @route api/v1/course
 * @access public
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const delData = await Course.findByIdAndDelete(id);

  await fileDataDeleteFromCloud(findPublicId(delData?.photo));

  res.status(200).json({ delData, message: "Delete course successfull" });
});

/**
 *
 * @description Update student
 * @method PEATCH
 * @route api/v1/student
 * @access public
 */

export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //get student data
  const { name, email, phone, photo } = req.body;

  // data validation
  if (!name) {
    return res.status(400).json({ message: "name and phone is required" });
  }

  const updata = await Student.findByIdAndUpdate(
    id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ updata, message: "update successfull" });
});

/**
 *
 * @description Create Student
 * @method POST
 * @route api/v1/student
 * @access public
 */

export const createCourse = async (req, res) => {
  //get student data
  const {
    type,
    classof,
    title,
    numberof,
    regularprice,
    offerprice,
    free,
    img,
  } = req.body;

  //check photo
  let fileData = null;
  if (req.file) {
    const data = await fileUploadToCloud(req.file.path);
    fileData = data.secure_url;
  }

  const data = await Course.create({
    type,
    classof,
    title,
    numberof,
    regularprice,
    offerprice,
    free,
    img: fileData,
  });

  res
    .status(200)
    .json({ course: data, message: "New course create successfull" });
};
