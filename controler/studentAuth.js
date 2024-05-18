import asyncHandler from "express-async-handler";
import { createOTP, isEmail, isMobile, tokenDecode } from "../helper/Helper.js";
import Student from "../model/studentSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileUploadToCloud } from "./../utils/cloudinary.js";

import { AccountActivationEmail } from "../emails/accountActivation.js";
import { sendSMS } from "../utils/sendSms.js";

/**
 * @description  student Register
 * @method POST
 * @route /api/v1/student
 * @access public
 */

export const studentRegister = asyncHandler(async (req, res) => {
  //get json data
  const { name, auth, password } = req.body;

  //data validation
  if (!name || !auth || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  //check auth
  let authEmail = null;
  let authPhone = null;

  if (isEmail(auth)) {
    authEmail = auth;
    //check valid email
    const checkEmail = await Student.findOne({ email: authEmail });
    if (checkEmail) {
      return res.status(400).json({ message: "email allready exists" });
    }
  }

  //check Phone
  if (isMobile(auth)) {
    authPhone = auth;
    //check valid phone
    const checkPhone = await Student.findOne({ phone: authPhone });
    if (checkPhone) {
      return res.status(400).json({ message: "Phone allready exists" });
    }
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, 10);

  //create otp
  const otp = createOTP();

  const student = await Student.create({
    name,
    nameHistory: [name],
    email: authEmail,
    phone: authPhone,
    password: hashPassword,
    accessToken: otp,
  });

  //create student
  if (student) {
    //sent token to cookie
    const activationToken = jwt.sign(
      { auth },

      process.env.ACCOUNT_ACTIVAION_SECRET,
      {
        expiresIn: "10min",
      }
    );

    res.cookie("activationToken", activationToken);

    //sent varification code
    // if (authEmail) {
    //   await AccountActivationEmail(auth, { code: otp, link: "" });
    // } else if (authPhone) {
    //   await sendSMS(auth, `Hello ${name} your activation OTP is ${otp}`);
    // } else {
    //   return res
    //     .status(400)
    //     .json({ message: "check phone or email sms limit" });
    // }

    //
  }

  //create login token
  // const accessToken = jwt.sign({ auth: student }, process.env.LOGIN_SECRET, {
  //   expiresIn: "36500d",
  // });

  //set token
  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: process.env.APP_ENV == "Development" ? false : true,
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 1000 * 60 * 60 * 24 * 365 * 100,
  // });

  //respons
  res.status(200).json({ auths: student, message: "Register successfull" });
});

// /**
//  * @description  student get activation token
//  * @method GET
//  * @route /api/v1/student/getactivation-token
//  * @access public
//  */
// export const getActivitonByOtp = asyncHandler(async (req, res) => {
//   const activationToken = req.cookies.activationToken;
//   console.log(activationToken);
// });

/**
 * @description  student Account Activition
 * @method POST
 * @route /api/v1/student
 * @access public
 */

export const accountActivitonByOtp = asyncHandler(async (req, res) => {
  //get token
  const { token } = req.params;
  const { otp } = req.body;

  //token dicode
  const activitionToken = tokenDecode(token);

  // veryfiy token
  const tokenVerify = jwt.verify(
    activitionToken,
    process.env.ACCOUNT_ACTIVAION_SECRET
  );

  //check token
  if (!tokenVerify) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  //activate Student
  let activateStudent = null;
  if (isEmail(tokenVerify.auth)) {
    activateStudent = await Student.findOne({ email: tokenVerify.auth });
    if (!activateStudent) {
      return res.status(400).json({ message: "Student email not found" });
    }
  } else if (isMobile(tokenVerify.auth)) {
    activateStudent = await Student.findOne({ phone: tokenVerify.auth });
    if (!activateStudent) {
      return res.status(400).json({ message: "Student phone not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid Student" });
  }

  //check otp
  if (otp !== activateStudent.accessToken) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  //update active Student
  activateStudent.isActive = true;
  activateStudent.accessToken = null;
  activateStudent.save();

  //clear cookie
  res.clearCookie("activitionToken");

  //final response
  res.status(200).json({ message: "Student Activation successfull" });
});

/**
 * @description  Student Login
 * @method POST
 * @route /api/v1/student/login
 * @access public
 */

export const StudentLoing = asyncHandler(async (req, res) => {
  //get student login data
  const { auth, password } = req.body;

  //login validatin
  if (!auth || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check loing user
  let loginSudent = null;
  if (isEmail(auth)) {
    loginSudent = await Student.findOne({ email: auth });
    if (!loginSudent) {
      return res.status(400).json({ message: "Student email not found" });
    }
  } else if (isMobile(auth)) {
    loginSudent = await Student.findOne({ phone: auth });
    if (!loginSudent) {
      return res.status(400).json({ message: "Student phone not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid Student" });
  }

  //check password
  const checkPass = bcrypt.compareSync(password, loginSudent.password);
  if (!checkPass) {
    return res.status(400).json({ message: "Wrong Password" });
  }

  //create login token
  const accessToken = jwt.sign({ auth: auth }, process.env.LOGIN_SECRET, {
    expiresIn: "36500d",
  });

  //set token
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 365 * 100,
  });

  //final response
  res
    .status(200)
    .json({ auth: loginSudent, message: "Login Student successfull" });
});

/**
 * @description  Student Logout
 * @method POST
 * @route /api/v1/student/login
 * @access public
 */

export const studentLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logut successfull" });
});

/**
 * @description  Logdin student
 * @method POST
 * @route /api/v1/student/logdin
 * @access private
 */

export const logdinStudent = asyncHandler(async (req, res) => {
  if (!req.me) {
    return res.status(400).json({ message: "Unautorized User" });
  }
  //final response
  res.status(200).json({ auth: req.me });
});

/**
 * @description  Change password
 * @method POST
 * @route /api/v1/student/change-password
 * @access private
 */

export const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword, conpass } = req.body;

  if (!oldpassword || !newpassword || !conpass) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newpassword != conpass) {
    return res.status(400).json({ message: "confirm password not match" });
  }

  const auth = await Student.findById(req.me._id);

  //check password
  const checkPass = bcrypt.compareSync(oldpassword, auth.password);

  if (!checkPass) {
    return res.status(400).json({ message: "Old password not match" });
  }

  //hass new passwor
  const hashpass = await bcrypt.hash(newpassword, 10);

  //Update new password
  auth.password = hashpass;
  auth.save();

  res.status(200).json({ message: "password Change successfull" });
});

/**
 * @description  show password
 * @method POST
 * @route /api/v1/student/show-password
 * @access private
 */

export const showPassword = asyncHandler(async (req, res) => {
  const auth = await Student.findById(req.me._id);

  //const password = auth.password;
  //check password
  const checkPass = bcrypt.compareSync(oldpassword, auth.password);
  console.log(checkPass);

  res.status(200).json({ message: "password Change successfull" });
});

/**
 * @description  Profile photo change
 * @method POST
 * @route /api/v1/student/profile-photo
 * @access private
 */

export const profilePhotoChange = asyncHandler(async (req, res) => {
  const filedata = await fileUploadToCloud(req.file.path);

  //find Auth
  const data = jwt.verify(req.cookies.accessToken, process.env.LOGIN_SECRET);

  let authData;
  if (isMobile(data.auth)) {
    authData = await Student.findOne({ phone: data.auth });
  }
  if (isEmail(data.auth)) {
    authData = await Student.findOne({ email: data.auth });
  }

  authData.photo = filedata.secure_url;

  authData.save();
  //final response
  res
    .status(200)
    .json({ auth: authData, message: "Profile updated successfull" });
});

/**
 *
 * @description update auth profile
 * @method POST
 * @route api/v1/student
 * @access public
 */

export const updateUserInfo = asyncHandler(async (req, res) => {
  const data = req.body;

  //get auth data
  const userProfileData = await Student.findById(req.me._id);

  //apdate data

  userProfileData.lastname = data.lastname;
  userProfileData.fathers_name = data.fathers_name;
  userProfileData.dob = data.dob;
  userProfileData.gender = data.gender;
  userProfileData.blood_group = data.blood_group;
  userProfileData.location = data.location;
  userProfileData.city = data.city;
  userProfileData.division = data.division;
  userProfileData.zipcode = data.zipcode;
  userProfileData.country = data.country;

  userProfileData.save();

  res
    .status(200)
    .json({ auth: userProfileData, message: "Profile Update successfull" });
});

/**
 *
 * @description Name Update
 * @method POST
 * @route api/v1/student/name
 * @access public
 */

export const nameUpdate = asyncHandler(async (req, res) => {
  const data = req.body;

  //get auth data
  const userName = await Student.findById(req.me._id);

  //find old name
  const oldName = userName.nameHistory;

  if (oldName.find((item) => item == data.name)) {
    return res.status(400).json({ message: "This name allready axist!" });
  }

  //apdate data
  userName.name = data.name;

  userName.nameHistory.push(data.name);

  userName.save();

  res.status(200).json({ auth: userName, message: "Name Update successfull" });
});
