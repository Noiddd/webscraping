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

    let jobs = [];

    await page.waitForSelector(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    );

    const jobsData = await page.$$eval(
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
          salaryRange = salaryExtract.replace("-", "");

          return {
            jobTitle,
            companyName,
            salaryRange,
          };
        })
    );

    console.log(jobsData);
    console.log(jobsData.length);

    const jobsContainer = await page.$$(
      "#mosaic-provider-jobcards ul li div div div div div.job_seen_beacon"
    );

    for (let i = 0; i < jobsContainer.length; i++) {
      await jobsContainer[i].click();

      await page.waitForSelector("#jobsearch-ViewjobPaneWrapper");

      const jobDescription = await page.$eval(
        "#jobDescriptionText",
        (el) => el.textContent
      );
    }

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
