const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=0"
  );

  let jobs = [];
  let isLastPageRemote = false;

  while (!isLastPageRemote) {
    await page.waitForSelector("#job-card-0");

    const jobContainer = await page.$$(
      "#search-results .card-list div div a div div section.flex"
    );

    for (const jobLink of jobContainer) {
      try {
        const jobTitle = await page.evaluate(
          (el) => el.querySelector("div div span").textContent,
          jobLink
        );

        const companyName = await page.evaluate(
          (el) => el.querySelector("div div p").textContent,
          jobLink
        );

        const companyLogo = await page.evaluate(
          (el) => el.querySelector("div div img").getAttribute("src"),
          jobLink
        );

        const jobCategory = await page.evaluate(
          (el) =>
            el.querySelector("div div section p.icon-bw-category").textContent,
          jobLink
        );

        const keyWords = [
          "Remote",
          "remote",
          "Work from home",
          "Work From Home",
        ];

        if (keyWords.some((keyWord) => jobTitle.includes(keyWord))) {
          jobs.push({ jobTitle, companyName, companyLogo, jobCategory });
        } else {
          continue;
        }
      } catch (error) {
        console.log(error);
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

  console.log(jobs.length + " jobs with remote as key word");

  await fs.writeFile("remote.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();

// Moving on to searching "work from home"

(async () => {
  let jobs = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=work%20from%20home&sortBy=new_posting_date&page=0"
  );

  let isLastPageWorkFromHome = false;
  while (!isLastPageWorkFromHome) {
    await page.waitForSelector("#job-card-0");

    const jobContainer = await page.$$(
      "#search-results .card-list div div a div div section.flex"
    );

    for (const jobLink of jobContainer) {
      try {
        const jobTitle = await page.evaluate(
          (el) => el.querySelector("div div span").textContent,
          jobLink
        );

        const companyName = await page.evaluate(
          (el) => el.querySelector("div div p").textContent,
          jobLink
        );

        const companyLogo = await page.evaluate(
          (el) => el.querySelector("div div img").getAttribute("src"),
          jobLink
        );

        const jobCategory = await page.evaluate(
          (el) =>
            el.querySelector("div div section p.icon-bw-category").textContent,
          jobLink
        );

        const keyWords = [
          "Remote",
          "remote",
          "Work from home",
          "Work From Home",
        ];

        if (keyWords.some((keyWord) => jobTitle.includes(keyWord))) {
          jobs.push({ jobTitle, companyName, companyLogo, jobCategory });
        } else {
          continue;
        }
      } catch (error) {
        console.log(error);
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
      isLastPageWorkFromHome = true;
    } else {
      await page.click("#search-results div.tc.pv3 button:last-of-type");
    }
  }

  console.log(jobs.length + " jobs with home as keyword");

  await fs.writeFile("workfromhome.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();
