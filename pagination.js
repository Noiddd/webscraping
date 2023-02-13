const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    " https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=new_posting_date&page=0",
    {
      waitUntil: "load",
    }
  );

  let lastPage = false;

  const rightButton = await page.$eval(
    "#search-results div.tc.pv3 button:last-of-type",
    (el) => el.textContent
  );

  if (rightButton !== "❯") {
    lastPage = true;
  }

  console.log(lastPage);

  await browser.close();
})();
