import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{console.log("database Connected !@@")})
    } catch (error) {
        console.log(error,"error while db connected")
    }
}
