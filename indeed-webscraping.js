const puppeteer = require("puppeteer");
const fs = require("fs/promises");

// Scarping for search "remote"

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://sg.indeed.com");

  //Wait for input field to load
  await page.waitForSelector("#text-input-what");

  // Inputing search fields
  await page.type("#text-input-what", "work from home");
  await page.type("#text-input-where", "singapore");

  // Clicking on search button
  await page.click("#jobsearch button");

  // Wait for first job to load
  await page.waitForSelector("#mosaic-provider-jobcards ul li:nth-child(1)");

  // Entry point for collecting data
  let isLastPage = false;
  let jobs = [];
  let jobsDataRight = [];

  // Collecting job data
  while (!isLastPage) {
    // Wait for left side to load
    await page.waitForSelector(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    );

    // Wait for right side to load
    await page.waitForSelector("#jobsearch-ViewjobPaneWrapper");

    // Collect from left side, job title, company name and salary
    const jobsDataLeft = await page.$$eval(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon",
      (el) =>
        el.map((jobData) => {
          const jobTitle = jobData.querySelector("h2 a span").textContent;
          const companyName = jobData.querySelector(
            "tbody tr td div.heading6.company_location.tapItem-gutter.companyInfo span"
          ).textContent;

          let salaryRange = "";
          let salaryExtract = "";

          try {
            salaryExtract = jobData.querySelector(
              "tbody tr td div div.salary-snippet-container div"
            ).textContent;
          } catch (error) {}

          salaryRange = salaryExtract.replace("- ", "");

          return {
            jobTitle,
            companyName,
            salaryRange,
          };
        })
    );

    console.log("job data length is " + jobsDataLeft.length);

    const jobsContainerLeft = await page.$$(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    );

    // Looping through left job container to collect: href, job description and posted days ago
    for (let i = 0; i < jobsContainerLeft.length; i++) {
      // Loop and click on left job container
      await jobsContainerLeft[i].click();

      // Wait for right side to load
      await page.waitForSelector("#jobsearch-ViewjobPaneWrapper");

      const url = await page.evaluate(
        (el) => el.querySelector("table tbody tr td div h2 a").href,
        jobsContainerLeft[i]
      );

      const jobDescription = await page.$eval(
        "#jobDescriptionText",
        (el) => el.textContent
      );

      const postedDaysAgo = await page.$eval(
        "#jobsearch-ViewjobPaneWrapper > div > div > div > div.icl-Grid.jobsearch-ViewJobLayout-content.jobsearch-ViewJobLayout-mainContent.css-okmmzf.eu4oa1w0 > div > div > div.jobsearch-ViewJobLayout-jobDisplay.icl-Grid-col.icl-u-xs-span12 > div > div.jobsearch-JobComponent-embeddedBody > div.jobsearch-JobComponent-description.jobsearch-JobComponent-description--embedded.icl-u-xs-mb--md > div.css-q7fux.eu4oa1w0 > ul li:last-of-type span:last-of-type",
        (el) => el.textContent
      );

      jobsDataRight.push({
        jobDescription,
        url,
        postedDaysAgo,
      });
    }

    // console.log(jobsDataRight);
    // console.log("job description legnth is " + jobsDataRight.length);

    // Filtering out jobs without salary
    for (let i = 0; i < jobsDataRight.length; i++) {
      if (jobsDataLeft[i].salaryRange == "") {
        continue;
      } else {
        jobs.push({ ...jobsDataLeft[i], ...jobsDataRight[i] });
      }
    }

    // console.log(jobs);
    console.log("Final job array length is " + jobs.length);

    // wait for last button to appear
    await page.waitForSelector(
      "#jobsearch-JapanPage div div div.jobsearch-SerpMainContent div.jobsearch-LeftPane nav div:last-of-type"
    );

    let nextPageButton = "not last";

    try {
      nextPageButton = await page.$eval(
        "#jobsearch-JapanPage div div div.jobsearch-SerpMainContent div.jobsearch-LeftPane nav div:last-of-type",
        (el) => el.textContent
      );
    } catch (error) {}

    if (nextPageButton == "") {
      await page.click(
        "#jobsearch-JapanPage div div div.jobsearch-SerpMainContent div.jobsearch-LeftPane nav div:last-of-type"
      );
    } else {
      isLastPage = true;
    }
  }

  await fs.writeFile("indeed-remote.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });
})();
