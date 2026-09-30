const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const speakerRoutes = require("./routes/speakerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

// Initial DB connection
connectDB();

const getDbStatus = () => {
    const states = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting"
    };
    const stateNum = mongoose.connection.readyState;
    const isConnected = stateNum === 1;
    return {
        connected: isConnected,
        stateCode: stateNum,
        status: states[stateNum] || "Unknown",
        host: mongoose.connection.host || "ac-zgx4ee7-shard-00-00.e7buwka.mongodb.net",
        name: mongoose.connection.name || "eventhub",
        target: "MongoDB Atlas Cloud Cluster"
    };
};

app.get("/", (req, res) => {
    const dbInfo = getDbStatus();
    res.json({
        status: "online",
        name: "EventHub API",
        version: "1.0.0",
        message: "EventHub Backend is Running & Ready",
        database: dbInfo,
        timestamp: new Date().toISOString()
    });
});

// Fast health endpoint (responds in <2ms, ideal for live frontend connection status)
app.get("/api/health", (req, res) => {
    const stateNum = mongoose.connection.readyState;
    const isConnected = stateNum === 1;
    res.json({
        status: isConnected ? "connected" : "connecting",
        connected: isConnected,
        database: getDbStatus(),
        timestamp: new Date().toISOString()
    });
});

// Dedicated separate endpoint to explicitly verify live Atlas database connection
app.get("/api/db-check", async (req, res) => {
    const startTime = Date.now();
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }

        if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
            await mongoose.connection.db.command({ ping: 1 });
            const latencyMs = Date.now() - startTime;
            return res.json({
                success: true,
                message: "MongoDB Atlas Cloud Cluster is fully connected and responding to queries!",
                database: {
                    connected: true,
                    status: "Connected",
                    clusterHost: mongoose.connection.host,
                    dbName: mongoose.connection.name,
                    pingLatencyMs: latencyMs
                },
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(503).json({
                success: false,
                message: "MongoDB Atlas is currently establishing connection...",
                database: getDbStatus(),
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `MongoDB Atlas connection error: ${error.message}`,
            database: getDbStatus(),
            timestamp: new Date().toISOString()
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`EventHub server running on port ${PORT}`);
});