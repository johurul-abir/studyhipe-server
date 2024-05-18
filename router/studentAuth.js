import {
  StudentLoing,
  accountActivitonByOtp,
  changePassword,
  logdinStudent,
  nameUpdate,
  profilePhotoChange,
  showPassword,
  studentLogout,
  studentRegister,
  updateUserInfo,
} from "../controler/studentAuth.js";
import express from "express";
import tokenVerify from "../middleware/tokenVerify.js";
import { studentMulter } from "../utils/multer.js";

//init Router
const router = express.Router();
router.post("/api/v1/register", studentRegister);
router.post("/api/v1/activate/:token", accountActivitonByOtp);
router.post("/api/v1/student/login", StudentLoing);
router.post("/api/v1/student/logout", studentLogout);
router.get("/api/v1/me", tokenVerify, logdinStudent);
router.post("/api/v1/changepass", tokenVerify, changePassword);
router.post("/api/v1/student/profile-photo", studentMulter, profilePhotoChange);
router.post("/api/v1/student/update-profile", tokenVerify, updateUserInfo);
router.post("/api/v1/student/update-name", tokenVerify, nameUpdate);
router.get("/api/v1/student/show-password", tokenVerify, showPassword);

//export default
export default router;
