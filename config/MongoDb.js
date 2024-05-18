import mongoose from "mongoose";

const MongoDbConnect = async () => {
  await mongoose.connect(process.env.MONGO_DB);

  try {
    console.log(`MongoDB connect successfull`.bgBlue);
  } catch (error) {
    console.log(`MongoDB connect Failed`.bgRed.white);
  }
};

//export default
export default MongoDbConnect;
