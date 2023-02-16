const puppeteer = require("puppeteer");
const fs = require("fs/promises");

// Scraping for search "remote"

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=0"
  );

  let pageNumber = 0;
  let jobs = [];
  let isLastPageRemote = false;

  while (!isLastPageRemote) {
    await page.waitForSelector("#job-card-0");

    const jobLinks = await page.$$eval(
      "#search-results .card-list div div a",
      (jobLinks) => {
        return jobLinks.map((jobLink) => {
          return jobLink.href;
        });
      }
    );

    for (let i = 0; i < jobLinks.length; i++) {
      try {
        await page.goto(jobLinks[i]);

        await page.waitForSelector("#job_title ");

        let jobTitle = "";
        let companyName = "";
        let salaryLowerLimit = "";
        let salaryUpperLimit = "";
        let jobCategory = "";
        let jobLevel = "";
        let employmentType = "";
        let minimumExperience = "";
        let postedDateExtract = "";
        let expiryDateExtract = "";
        let jobDescription = "";

        // Scraping for job information

        try {
          jobTitle = await page.$eval("#job_title", (el) => el.textContent);
        } catch (err) {}

        try {
          companyName = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div section:nth-child(1) p",
            (el) => el.textContent
          );
        } catch (err) {}

        try {
          salaryLowerLimit = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div div section.salary.w-100.mt3.mb2.tr div span.dib.f2-5.fw6.black-80 div span:nth-child(1)",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          salaryUpperLimit = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div div section.salary.w-100.mt3.mb2.tr div span.dib.f2-5.fw6.black-80 div span:nth-child(2)",
            (el) => el.textContent
          );
        } catch (error) {}

        salaryRange =
          salaryLowerLimit + " " + salaryUpperLimit.replace("to", "");

        try {
          postedDateExtract = await page.$eval(
            "#last_posted_date",
            (el) => el.textContent
          );
        } catch (error) {}
        const postedDate = postedDateExtract.replace("Posted", "").trim();

        try {
          expiryDateExtract = await page.$eval(
            "#expiry_date",
            (el) => el.textContent
          );
        } catch (error) {}
        const expiryDate = expiryDateExtract.replace("Closing on", "").trim();

        try {
          jobCategory = await page.$eval(
            "#job-categories",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          jobLevel = await page.$eval("#seniority", (el) => el.textContent);
        } catch (error) {}

        try {
          employmentType = await page.$eval(
            "#employment_type",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          minimumExperience = await page.$eval(
            "#min_experience",
            (el) => el.textContent
          );
        } catch (err) {}

        try {
          jobDescription = await page.$eval(
            "#description-content",
            (el) => el.textContent
          );
        } catch (error) {}

        // Filtering for keywords in job title
        const keyWords = [
          "Remote",
          "remote",
          "Work from home",
          "Work From Home",
          "work from home",
          "from home",
        ];

        if (keyWords.some((keyWord) => jobTitle.includes(keyWord))) {
          jobs.push({
            jobTitle,
            companyName,
            salaryRange,
            jobCategory,
            jobLevel,
            employmentType,
            postedDate,
            expiryDate,
            minimumExperience,
            jobDescription,
          });
        }

        // if its the last iteration, navigate to new page
        if (i === jobLinks.length - 1) {
          await page.goto(
            `https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=${pageNumber}`
          );
          pageNumber += 1;
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }

    // wait for last button to appear (either right arrow or next page number)
    await page.waitForSelector(
      "#search-results div.tc.pv3 button:last-of-type"
    );

    const nextPageButton = await page.$eval(
      "#search-results div.tc.pv3 button:last-of-type",
      (el) => el.textContent
    );

    if (nextPageButton !== "❯") {
      isLastPageRemote = true;
    } else {
      await page.click("#search-results div.tc.pv3 button:last-of-type");
    }
  }

  console.log(jobs.length + " remote jobs results");

  await fs.writeFile("mcf-remote.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();

// Scraping for search "work from home"

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=work%20from%20home&sortBy=relevancy&page=0"
  );

  let pageNumber = 0;
  let jobs = [];
  let isLastPageRemote = false;

  while (!isLastPageRemote) {
    await page.waitForSelector("#job-card-0");

    const jobLinks = await page.$$eval(
      "#search-results .card-list div div a",
      (jobLinks) => {
        return jobLinks.map((jobLink) => {
          return jobLink.href;
        });
      }
    );

    for (let i = 0; i < jobLinks.length; i++) {
      try {
        await page.goto(jobLinks[i]);

        await page.waitForSelector("#job_title ");

        let jobTitle = "";
        let companyName = "";
        let salaryLowerLimit = "";
        let salaryUpperLimit = "";
        let jobCategory = "";
        let jobLevel = "";
        let employmentType = "";
        let minimumExperience = "";
        let postedDateExtract = "";
        let expiryDateExtract = "";
        let jobDescription = "";

        // Scraping for job information

        try {
          jobTitle = await page.$eval("#job_title", (el) => el.textContent);
        } catch (err) {}

        try {
          companyName = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div section:nth-child(1) p",
            (el) => el.textContent
          );
        } catch (err) {}

        try {
          salaryLowerLimit = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div div section.salary.w-100.mt3.mb2.tr div span.dib.f2-5.fw6.black-80 div span:nth-child(1)",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          salaryUpperLimit = await page.$eval(
            "#job-details div.w-70-l.w-60-ms.w-100.pr2-l.pr2-ms.relative div:nth-child(3) div div section.salary.w-100.mt3.mb2.tr div span.dib.f2-5.fw6.black-80 div span:nth-child(2)",
            (el) => el.textContent
          );
        } catch (error) {}

        salaryRange =
          salaryLowerLimit + " " + salaryUpperLimit.replace("to", "");

        try {
          postedDateExtract = await page.$eval(
            "#last_posted_date",
            (el) => el.textContent
          );
        } catch (error) {}
        const postedDate = postedDateExtract.replace("Posted", "").trim();

        try {
          expiryDateExtract = await page.$eval(
            "#expiry_date",
            (el) => el.textContent
          );
        } catch (error) {}
        const expiryDate = expiryDateExtract.replace("Closing on", "").trim();

        try {
          jobCategory = await page.$eval(
            "#job-categories",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          jobLevel = await page.$eval("#seniority", (el) => el.textContent);
        } catch (error) {}

        try {
          employmentType = await page.$eval(
            "#employment_type",
            (el) => el.textContent
          );
        } catch (error) {}

        try {
          minimumExperience = await page.$eval(
            "#min_experience",
            (el) => el.textContent
          );
        } catch (err) {}

        try {
          jobDescription = await page.$eval(
            "#description-content",
            (el) => el.textContent
          );
        } catch (error) {}

        // Filtering for keywords in job title
        const keyWords = [
          "Remote",
          "remote",
          "Work from home",
          "Work From Home",
          "work from home",
          "from home",
        ];

        if (keyWords.some((keyWord) => jobTitle.includes(keyWord))) {
          jobs.push({
            jobTitle,
            companyName,
            salaryRange,
            jobCategory,
            jobLevel,
            employmentType,
            postedDate,
            expiryDate,
            minimumExperience,
            jobDescription,
          });
        }

        // if its the last iteration, navigate to new page
        if (i === jobLinks.length - 1) {
          await page.goto(
            `https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=${pageNumber}`
          );
          pageNumber += 1;
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }

    // wait for last button to appear (either right arrow or next page number)
    await page.waitForSelector(
      "#search-results div.tc.pv3 button:last-of-type"
    );

    const nextPageButton = await page.$eval(
      "#search-results div.tc.pv3 button:last-of-type",
      (el) => el.textContent
    );

    if (nextPageButton !== "❯") {
      isLastPageRemote = true;
    } else {
      await page.click("#search-results div.tc.pv3 button:last-of-type");
    }
  }

  console.log(jobs.length + " work from home results");

  await fs.writeFile("mcf-workfromhome.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();
