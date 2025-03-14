const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Get all jobs with filters
router.get("/", jobController.getJobs);

// Get job by ID
router.get("/:id", jobController.getJobById);

// Manual trigger for job scraping
router.post("/scrape", jobController.triggerJobScrape);

module.exports = router;
