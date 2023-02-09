const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.mycareersfuture.gov.sg/search?search=remote%20work&sortBy=new_posting_date&page=0"
  );

  const jobContainer = await page.$$(
    "#search-results .card-list div div a div div section.flex"
  );

  let jobs = [];

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

  console.log(jobs);

  await fs.writeFile("practice.json", JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
})();
