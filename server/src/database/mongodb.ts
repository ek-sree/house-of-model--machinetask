import mongoose from "mongoose";
import config from "../config";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.DB_URI, {
            ssl: true,  // Enable SSL explicitly (this is still necessary for Atlas)
            tlsInsecure: false,  // Ensure SSL verification
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log("Error connecting to MongoDB:");
        console.log(error);
        if (error instanceof Error) {
            console.log("Error message:", error.message);
            console.log("Error name:", error.name);
        }
    }
};
