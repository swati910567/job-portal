const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    applicationLink: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["LinkedIn", "Naukri"],
      default: "LinkedIn",
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search functionality
jobSchema.index({ title: "text", company: "text", location: "text" });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
