const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub";
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Atlas / Local Connected Successfully: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.warn("⚠️ MongoDB Connection Notice:", error.message);
        console.log("ℹ️ EventHub Server running with fallback mock persistence enabled until MongoDB connection is active.");
        return null;
    }
};

module.exports = connectDB;

