const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=0"
  );

  let jobs = [];
  let isLastPage = false;

  while (!isLastPage) {
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

        jobs.push({ jobTitle, companyName, companyLogo, jobCategory });
      } catch (error) {
        console.log(error);
      }
    }

    await page.waitForSelector(
      "#search-results div.tc.pv3 button:last-of-type"
    );

    const nextPageButton = await page.$eval(
      "#search-results div.tc.pv3 button:last-of-type",
      (el) => el.textContent
    );

    if (nextPageButton !== "❯") {
      isLastPage = true;
    } else {
      await page.click("#search-results div.tc.pv3 button:last-of-type");
    }
  }

  console.log(jobs.length);

  await fs.writeFile("practice.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();
