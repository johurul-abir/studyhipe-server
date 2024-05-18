import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    oldname: {
      type: [String],
      trim: true,
      default: [],
    },
    nameHistory: {
      type: [String],
      trim: true,
      defalut: [],
    },
    lastname: {
      type: String,
      trim: true,
    },
    fathers_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    authInfo: {
      type: [String],
      trim: true,
      default: [],
    },
    roll: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      default: null,
    },
    dob: {
      type: String,
      trim: true,
      default: null,
    },
    gender: {
      type: String,
      default: false,
    },
    blood_group: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    division: {
      type: String,
      default: null,
    },
    zipcode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    classname: {
      type: String,
      default: null,
    },
    courses: {
      type: [String],
      default: [],
    },
    batch: {
      type: [String],
      default: [],
    },
    institiute: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    accessToken: {
      type: String,
      default: null,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//export default
export default mongoose.model("Student", studentSchema);
