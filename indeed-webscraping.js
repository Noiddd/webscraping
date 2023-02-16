const puppeteer = require("puppeteer");
const fs = require("fs/promises");

// Scarping for search "remote"

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://sg.indeed.com");

  // Inputing search fields
  await page.type("#text-input-what", "remote");
  await page.type("#text-input-where", "singapore");

  // Clicking on search button
  await page.click("#jobsearch button");

  // Waiting for filter location to load then clicking on it
  await page.waitForSelector("#filter-loc");
  await page.click("#filter-loc");

  // Waiting for drop down then click on "Remote"
  await page.waitForSelector("#filter-loc-menu li:nth-child(2)");
  //   const test = await page.$eval("#filter-loc-menu li:nth-child(2)", (el) =>
  //     el.click()
  //   );
  //   console.log(test);
  //   await page.click("#filter-loc-menu li:nth-child(2)");

  // Collecting job data

  const jobContainer = await page.$$eval(
    "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon",
    (jobContainer) => {
      return jobContainer.map((jobLink) => ({
        jobTitle: jobLink.querySelector("h2 a span").textContent,
      }));
    }
  );

  console.log(jobContainer);
})();
