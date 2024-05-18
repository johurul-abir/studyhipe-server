import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "_" +
        Math.floor(Math.random) * 10000 +
        "_" +
        file.originalname
    );
  },
});

//export multer middleware
export const studentMulter = multer({ storage }).single("studentphoto");
export const courseMulter = multer({ storage }).single("coursephoto");
export const teacherMulter = multer({ storage }).single("teacherphoto");
export const noticeMulter = multer({ storage }).single("noticephoto");
