import mongoose from 'mongoose';

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log(`Connect to DB`);
  } catch (error) {
    console.log(error);
  }
}
