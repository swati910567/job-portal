const Job = require("../models/Job");
const scraperService = require("../services/scraperService");

// Get jobs with filtering, pagination and search
exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = {};

    // Search by title
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: "i" };
    }

    // Filter by experience
    if (req.query.experience) {
      query.experience = { $regex: req.query.experience, $options: "i" };
    }

    // Filter by company
    if (req.query.company) {
      query.company = { $regex: req.query.company, $options: "i" };
    }

    // Filter by source
    if (req.query.source) {
      query.source = req.query.source;
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Trigger job scraping manually
exports.triggerJobScrape = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    // Start scraping process
    const message = "Job scraping started in the background";
    res.json({ message });

    // Execute scraping asynchronously
    await scraperService.scrapeJobs(keyword);
  } catch (error) {
    console.error("Error triggering job scrape:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
