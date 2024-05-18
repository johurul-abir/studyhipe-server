import mongoose from "mongoose";

const noticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },

    text: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      trim: true,
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
export default mongoose.model("Notice", noticeSchema);
