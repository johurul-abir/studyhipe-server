import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getAllTeacher,
} from "../controler/teacherControl.js";
import { teacherMulter } from "../utils/multer.js";

//init router
const router = express.Router();

//all student routers
router.post("/teacher", teacherMulter, createTeacher);
router.get("/teacher", getAllTeacher);
router.delete("/teacher/:id", deleteTeacher);
//router.get("/student/:id", singleStudent);
//router.patch("/student/:id", updateStudent);

//export default router
export default router;
