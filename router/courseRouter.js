import express from "express";
import { courseMulter } from "../utils/multer.js";
import {
  getAllCourse,
  createCourse,
  deleteCourse,
} from "../controler/courseControler.js";

//init router
const router = express.Router();

//all student routers
router.post("/course", courseMulter, createCourse);
router.get("/course", getAllCourse);
router.delete("/course/:id", deleteCourse);
//router.get("/student/:id", singleStudent);
//router.patch("/student/:id", updateStudent);

//export default router
export default router;
