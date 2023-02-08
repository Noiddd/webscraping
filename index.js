const puppeteer = require('puppeteer')

async function start(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://www.mycareersfuture.gov.sg/search?search=remote&sortBy=relevancy&page=0")
    await page.screenshot({path:"amazing.png", fullPage: true})
    await browser.close()
}

start()