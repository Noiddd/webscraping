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
  await page.type("#text-input-what", "remote");
  await page.type("#text-input-where", "remote");

  // Clicking on search button
  await page.click("#jobsearch button");

  // Wait for first job to load
  await page.waitForSelector("#mosaic-provider-jobcards ul li:nth-child(1)");

  // Entry point for collecting data
  let pageNumber = 0;
  let isLastPage = false;

  // Collecting job data
  while (!isLastPage) {
    // const jobData = await page.evaluate(() => {
    //   jobContainer = Array.from(
    //     document.querySelectorAll(
    //       "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    //     )
    //   );

    //   console.log("jobcontainer" + jobContainer);

    //   const jobs = jobContainer.map((jobLink) => ({
    //     jobTitle: jobLink.querySelector("h2 a span").textContent,
    //     companyName: jobLink.querySelector("span.companyName").textContent,
    //   }));

    //   return jobs;
    // });

    // console.log(jobData);
    // console.log(jobData.length);

    const jobsTest = await page.$$(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    );

    for (const jobLink of jobsTest) {
      await jobLink.click();

      await page.waitForSelector("#jobsearch-ViewjobPaneWrapper");

      const jobDescription = await page.$eval(
        "#jobDescriptionText",
        (el) => el.textContent
      );

      console.log(jobDescription);
    }

    console.log(jobsTest);

    isLastPage = true;
  }

  // await fs.writeFile(
  //   "indeed-remote.json",
  //   JSON.stringify(jobContainer),
  //   (err) => {
  //     if (err) throw err;
  //     console.log("File saved");
  //   }
  // );
})();
