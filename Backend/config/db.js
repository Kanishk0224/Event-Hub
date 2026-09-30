const mongoose = require("mongoose");
const dns = require("dns");

try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {}

let isConnecting = false;
let retryTimer = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    if (isConnecting) return null;

    isConnecting = true;
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub";
        const isAtlas = uri.includes("mongodb+srv://") || uri.includes(".mongodb.net");
        
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            autoIndex: true
        });

        const hostType = isAtlas ? "MongoDB Atlas Cloud Cluster" : "Local MongoDB";
        console.log(`✅ [Database] ${hostType} Connected Successfully! Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
        
        if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
        }

        return conn;
    } catch (error) {
        console.error("❌ [Database Connection Failed]:", error.message);
        if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
            console.error("💡 Hint: Check your Atlas username & password in Backend/.env");
        } else if (error.message.includes("whitelist") || error.message.includes("ETIMEDOUT") || error.message.includes("ServerSelectionError") || error.message.includes("ENOTFOUND")) {
            console.error("💡 Hint: Ensure 0.0.0.0/0 is added in MongoDB Atlas -> 'Network Access'");
        }

        // Auto-retry connection in background every 5 seconds until Atlas connects
        if (!retryTimer) {
            retryTimer = setInterval(() => {
                if (mongoose.connection.readyState !== 1) {
                    console.log("🔄 Retrying MongoDB Atlas connection in background...");
                    connectDB();
                }
            }, 6000);
        }
        return null;
    } finally {
        isConnecting = false;
    }
};

// Setup connection lifecycle event handlers
mongoose.connection.on("error", (err) => {
    console.error("❌ [Database] Connection Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ [Database] Connection Lost. Attempting reconnect...");
    connectDB();
});

mongoose.connection.on("reconnected", () => {
    console.log("🔄 [Database] Reconnected to MongoDB Atlas!");
});

module.exports = connectDB;


