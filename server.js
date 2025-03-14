const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes.js");
const cron = require("node-cron");
const scraperService = require("./services/scraperService.js");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: ['cool-salmiakki-b75efe.netlify.app', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);

// Schedule job scraping every 24 hours
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily job scraping...");
  try {
    await scraperService.scrapeJobs();
    console.log("Daily job scraping completed successfully");
  } catch (error) {
    console.error("Error in scheduled job scraping:", error);
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Job Board API is running");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
