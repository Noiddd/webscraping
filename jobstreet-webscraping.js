const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");

const fs = require("fs/promises");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  await page.goto("https://www.jobstreet.com.sg/");

  // Wait for input field to load
  await page.waitForSelector("#searchKeywordsField");

  //   await page.waitForSelector(
  //     "#contentContainer > div > div > div > div > div:nth-child(1) > div:nth-child(4) > section > div > div:nth-child(2) > div > ul > li:nth-child(1)"
  //   );

  // Inputing search fields
  await page.type("#searchKeywordsField", "work from home");

  // Clicking on search button
  await page.click(
    "#contentContainer > div > div> div > div > div > div > div > div > form > div > div > div> div > button"
  );

  // Wait for filter button to load
  await page.waitForSelector(
    "#srpSearchForm > div > div > form > div > div > div > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div > button"
  );

  //   // Entry point for collecting data
  let isLastPage = false;
  let jobs = [];
  let pageNumber = 0;

  //   // Collecting job data

  while (!isLastPage) {
    await page.waitForSelector(
      "#jobList > div > div > div > div > div > div > article"
    );

    let jobsDataLeft = [];
    jobsDataLeft = await page.$$eval(
      "#jobList > div > div > div > div > div > div > article",
      (el) => {
        return el.map((jobData) => {
          const salary = jobData.querySelector(
            "div > div > div > div:nth-child(1) > span:last-of-type"
          ).textContent;
          const jobTitle = jobData.querySelector(
            "div > div > div> div:nth-child(1) > div:nth-child(2) > h1 > a > div > span"
          ).textContent;

          const companyName = jobData.querySelector(
            "div > div > div> div:nth-child(1) > div:nth-child(2) > span > span > a"
          ).textContent;

          return { jobTitle, companyName, salary };
        });
      }
    );

    console.log(jobsDataLeft);
    console.log(jobsDataLeft.length);

    isLastPage = true;
  }
})();
