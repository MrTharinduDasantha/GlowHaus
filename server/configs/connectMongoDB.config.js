// MongoDB connection helper.

import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    // mongoose v8 no longer needs useNewUrlParser / useUnifiedTopology options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If we can't connect to the DB, the app cannot run — exit hard.
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
