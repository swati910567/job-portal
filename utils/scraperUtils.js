// Function to scroll down a page to load all content (for infinite scrolling pages)
exports.autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

// Function to clean text (remove extra whitespace)
exports.cleanText = (text) => {
  return text.replace(/\s+/g, " ").trim();
};

// Function to extract domain from URL
exports.extractDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "").split(".")[0];
  } catch (error) {
    return "";
  }
};

// Function to normalize experience string
exports.normalizeExperience = (experienceStr) => {
  // Clean the string
  const cleaned = experienceStr.toLowerCase().trim();

  // If it contains years, extract the range
  if (cleaned.includes("year")) {
    const numbers = cleaned.match(/\d+/g);
    if (numbers && numbers.length >= 1) {
      if (numbers.length >= 2) {
        return `${numbers[0]}-${numbers[1]} years`;
      } else {
        return `${numbers[0]} years`;
      }
    }
  }

  // If it contains months, convert to years if more than 12
  if (cleaned.includes("month")) {
    const numbers = cleaned.match(/\d+/g);
    if (numbers && numbers.length >= 1) {
      const months = parseInt(numbers[0]);
      if (months >= 12) {
        const years = Math.floor(months / 12);
        return `${years} years`;
      } else {
        return `${months} months`;
      }
    }
  }

  // If none of the above, return as is or default value
  return experienceStr || "Not specified";
};
