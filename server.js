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
app.use(
  cors({
    origin: "https://curious-horse-3cf48a.netlify.app", // Specify frontend domain
    credentials: true, // Allow cookies/sessions
  })
);
// Middleware
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://curious-horse-3cf48a.netlify.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);
//app.use("/jobs", jobRoutes);

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
