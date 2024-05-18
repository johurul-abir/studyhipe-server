import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dfm7vtziu",
  api_key: "249216623551712",
  api_secret: "OiXwDqso10SakbhN1-ikn7jZafc",
});

//upload photo to cloudinary
export const fileUploadToCloud = async (path) => {
  const data = await cloudinary.uploader.upload(path);
  return data;
};

//delete photo from cloudinary
export const fileDataDeleteFromCloud = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
