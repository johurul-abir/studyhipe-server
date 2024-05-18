import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },

    classof: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
      default: null,
    },
    numberof: {
      type: Number,
      trim: true,
      default: null,
    },
    regularprice: {
      type: String,
      default: null,
    },
    offerprice: {
      type: String,
      default: null,
    },

    free: {
      type: String,
      default: null,
    },
    img: {
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
export default mongoose.model("Course", courseSchema);
