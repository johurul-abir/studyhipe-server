import {
  createStudent,
  deleteStudent,
  getAllStudent,
  updateStudent,
} from "../controler/studentControler.js";
import express from "express";
import { studentMulter } from "../utils/multer.js";

//init router
const router = express.Router();

//all student routers
router.post("/student", studentMulter, createStudent);
router.get("/student", getAllStudent);
router.delete("/student/:id", deleteStudent);

router.patch("/student/:id", updateStudent);

//export default router
export default router;
