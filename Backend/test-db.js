const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Ensure Atlas SRV records resolve reliably on all ISPs and Windows systems
try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
    // Ignore if not supported
}

async function testConnection() {
    console.log("=================================================");
    console.log("       🔍 MongoDB Atlas Connection Checker       ");
    console.log("=================================================");
    
    const rawUri = process.env.MONGO_URI || "";
    const maskedUri = rawUri.replace(/:([^:@]+)@/, ":••••••••@");
    
    console.log(`📌 Target URI : ${maskedUri}`);
    console.log(`🌐 Type       : ${rawUri.includes("mongodb+srv://") ? "MongoDB Atlas Cloud Cluster" : "Local MongoDB"}`);
    console.log("⏳ Connecting to database...");

    const startTime = Date.now();

    try {
        const conn = await mongoose.connect(rawUri, {
            serverSelectionTimeoutMS: 8000
        });

        const elapsedMs = Date.now() - startTime;
        const db = mongoose.connection.db;
        const adminDb = db.admin();
        const pingResult = await adminDb.ping();
        const collections = await db.listCollections().toArray();

        console.log("\n=================================================");
        console.log("  🎉 CONNECTION SUCCESSFUL! MONGODB ATLAS IS LIVE ");
        console.log("=================================================");
        console.log(`✅ Status       : Connected (ReadyState: ${mongoose.connection.readyState})`);
        console.log(`📍 Cluster Host : ${conn.connection.host}`);
        console.log(`📂 Database     : ${conn.connection.name}`);
        console.log(`⚡ Ping Latency : ${elapsedMs} ms`);
        console.log(`📦 Collections  : ${collections.length > 0 ? collections.map(c => c.name).join(", ") : "(Empty / newly created db)"}`);
        console.log("=================================================\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        const elapsedMs = Date.now() - startTime;
        console.log("\n=================================================");
        console.log("  ❌ CONNECTION FAILED                           ");
        console.log("=================================================");
        console.log(`⚠️ Error Message : ${error.message}`);
        console.log(`⏱️ Duration      : ${elapsedMs} ms`);
        
        if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
            console.log("💡 Tip: Invalid username or password in MONGO_URI in Backend/.env");
        } else if (error.message.includes("whitelist") || error.message.includes("ETIMEDOUT") || error.message.includes("ServerSelectionError")) {
            console.log("💡 Tip: Check MongoDB Atlas -> Network Access -> Add IP Address (0.0.0.0/0)");
        }
        console.log("=================================================\n");
        process.exit(1);
    }
}

testConnection();
