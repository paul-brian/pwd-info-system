require("dotenv").config();
const express = require("express");
const cors = require("cors");


//auth routes
const authRoutes = require("./routes/auth.routes");

//dashboard routes
const dashboardRoutes = require("./routes/dashboard/dashboard.routes");

//pwd_profiles routes
const pwdRoutes = require("./routes/profiling/pwd_profile.routes");

// //profile edit, password change, image upload
const profileRoutes = require("./routes/profile.routes");

//inventory routes
const inventoryRoutes = require("./routes/inventory/inventory.routes");
const donationRoutes = require("./routes/inventory/donation.routes");
const distributionRoutes = require("./routes/inventory/distribution.routes");

//health routes
const healthRoutes = require("./routes/health/health.routes");

//attendance routes
const eventRoutes = require("./routes/event/event.routes");
const eventAttendanceRoutes = require("./routes/event/event_attendance.routes");

//settings routes
const accessRoutes = require("./routes/settings/access.routes");
const userRoutes = require("./routes/settings/user.routes");



const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pwd-system-lac.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use("/uploads", express.static("uploads"));


//Auth API
app.use("/api/auth", authRoutes);

//Dashboard API
app.use("/api/dashboard", dashboardRoutes);

//pwd_profiles API
app.use("/api/pwd", pwdRoutes);

//profile edit, password change, image upload API
app.use("/api/profile", profileRoutes);

//inventory API
app.use("/api/inventory", inventoryRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distribution", distributionRoutes);

//health API
app.use("/api/health", healthRoutes);

//events and attendance API
app.use("/api/events", eventRoutes);
app.use("/api/attendance", eventAttendanceRoutes);

//settings API
app.use("/api/access", accessRoutes);
app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});