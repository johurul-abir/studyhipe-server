import mongoose from "mongoose";

const teacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    gallery: {
      type: [String],
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
export default mongoose.model("Teacher", teacherSchema);
