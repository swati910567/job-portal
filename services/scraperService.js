const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const Job = require("../models/Job");
const scraperUtils = require("../utils/scraperUtils");

// Function to scrape LinkedIn jobs
const scrapeLinkedInJobs = async (keyword) => {
  console.log(`Scraping LinkedIn jobs for keyword: ${keyword}`);
  const jobs = [];

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to LinkedIn jobs
    const searchKeyword = encodeURIComponent(keyword);
    await page.goto(
      `https://www.linkedin.com/jobs/search/?keywords=${searchKeyword}&location=India`,
      {
        waitUntil: "networkidle2",
      }
    );

    // Wait for job listings to load
    await page.waitForSelector(".jobs-search__results-list", {
      timeout: 10000,
    });

    // Scroll to load more jobs
    await scraperUtils.autoScroll(page);

    // Get page content and parse with cheerio
    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract job information
    $(".jobs-search__results-list li").each((index, element) => {
      const title = $(element).find(".base-search-card__title").text().trim();
      const company = $(element)
        .find(".base-search-card__subtitle")
        .text()
        .trim();
      const location = $(element)
        .find(".job-search-card__location")
        .text()
        .trim();
      const applicationLink =
        $(element).find(".base-card__full-link").attr("href") || "";

      // For LinkedIn, experience isn't directly available, so we'll use a placeholder
      const experience = "Not specified";

      if (title && company && location) {
        jobs.push({
          title,
          company,
          location,
          experience,
          applicationLink,
          source: "LinkedIn",
          postedDate: new Date(),
          scrapedAt: new Date(),
        });
      }
    });

    await browser.close();
    console.log(`Scraped ${jobs.length} jobs from LinkedIn`);
  } catch (error) {
    console.error("Error scraping LinkedIn jobs:", error);
  }

  return jobs;
};

// Function to scrape Naukri jobs
const scrapeNaukriJobs = async (keyword) => {
  console.log(`Scraping Naukri jobs for keyword: ${keyword}`);
  const jobs = [];

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Navigate to Naukri jobs
    const searchKeyword = encodeURIComponent(keyword);
    await page.goto(`https://www.naukri.com/jobs-in-india?k=${searchKeyword}`, {
      waitUntil: "networkidle2",
    });

    // Wait for job listings to load
    await page.waitForSelector(".list", { timeout: 10000 });

    // Scroll to load more jobs
    await scraperUtils.autoScroll(page);

    // Get page content and parse with cheerio
    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract job information
    $(".jobTuple").each((index, element) => {
      const title = $(element).find(".title").text().trim();
      const company = $(element).find(".companyInfo").text().trim();
      const location = $(element).find(".locWdth").text().trim();
      const experience = $(element).find(".experience").text().trim();
      const applicationLink = $(element).find("a.title").attr("href") || "";

      if (title && company && location) {
        jobs.push({
          title,
          company,
          location,
          experience: experience || "Not specified",
          applicationLink,
          source: "Naukri",
          postedDate: new Date(),
          scrapedAt: new Date(),
        });
      }
    });

    await browser.close();
    console.log(`Scraped ${jobs.length} jobs from Naukri`);
  } catch (error) {
    console.error("Error scraping Naukri jobs:", error);
  }

  return jobs;
};

// Main function to scrape jobs from both sources and save to database
exports.scrapeJobs = async (keyword = "Product Manager") => {
  try {
    // Scrape from both sources
    const linkedInJobs = await scrapeLinkedInJobs(keyword);
    const naukriJobs = await scrapeNaukriJobs(keyword);

    // Combine jobs from both sources
    const allJobs = [...linkedInJobs, ...naukriJobs];

    if (allJobs.length === 0) {
      console.log("No jobs found during scraping");
      return;
    }

    // Save jobs to database
    // We'll use insertMany with ordered: false to continue even if some insertions fail
    const result = await Job.insertMany(allJobs, { ordered: false });
    console.log(`Successfully saved ${result.length} new jobs to database`);

    return result;
  } catch (error) {
    // If the error is a BulkWriteError, some jobs might have been inserted
    if (error.name === "BulkWriteError") {
      console.log(
        `Inserted ${error.insertedDocs.length} jobs despite some errors`
      );
    } else {
      console.error("Error in scrapeJobs service:", error);
    }
    throw error;
  }
};
