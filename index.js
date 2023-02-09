const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start() {
  const browser = await puppeteer.launch(); // essentially opening up a browser
  const page = await browser.newPage();

  const testUrl = "https://learnwebcode.github.io/practice-requests/";
  const indeedUrl =
    "https://sg.indeed.com/jobs?q=remote&l=&from=searchOnHP&vjk=931c3679d5144ff4";
  const myCarrerFuturesUrl =
    "https://www.mycareersfuture.gov.sg/search?search=remote%20work&sortBy=new_posting_date&page=0";

  await page.goto(myCarrerFuturesUrl);

  const myCTJobs = await page.$$eval(
    "#search-results .card-list div div a div div section.flex",
    (elements) => {
      return elements.map((e) => ({
        jobTitle: e.querySelector("div div span").textContent,
        companyName: e.querySelector("div div p").textContent,
        companyLogo: e.querySelector("div div img").src,
        jobCategory: e.querySelector("div div section p.icon-bw-category")
          .textContent,
      }));
    }
  );

  //   const myCTJobsTest = await page.$$eval(
  //     "#search-results .card-list div div a",
  //     (links) => {
  //       return links.map((link) => {
  //         return link.href;
  //       });
  //     }
  //   );

  //   for (const link of myCTJobsTest) {
  //     await page.goto(link);

  //     const jobTitle = await page.$$eval("#job_title", (elements) =>
  //       elements.map((e) => ({ jobTitle: e.textContent }))
  //     );

  //     await fs.writeFile("jobListing.json", JSON.stringify(jobTitle), (err) => {
  //       if (err) throw err;
  //       console.log("File Saved in job listing");
  //     });

  //     console.log(jobTitle);
  //   }

  //   console.log("Names: " + names);
  //   console.log(indeedJobs);
  console.log("MyCareersFuture Jobs: " + myCTJobs);

  await fs.writeFile("test.json", JSON.stringify(myCTJobs), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
}

start();
