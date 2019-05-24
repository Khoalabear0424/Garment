const express = require('express');
const app = express();
const router = express.Router();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongojs = require("mongojs");
const insertDataIntoDB = require('../../utils/lib/insertIntoDB');


var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

const pagesToScrape = 8;

router.get('/', function (req, res) {
    let scrape = async () => {
        function wait(ms) {
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        }
        var browser = await puppeteer.launch({ headless: false });
        var page = await browser.newPage();
        await page.goto('https://www.madewell.com/womens/sale');
        await page.waitForSelector('.ui-widget-overlay');
        await page.click('.ui-button');

        // Get the height of the rendered page
        const bodyHandle = await page.$('body');
        let { height } = await bodyHandle.boundingBox();
        let totalHeight = height * pagesToScrape;
        await bodyHandle.dispose();

        // Scroll one viewport at a time, pausing to let content load
        const viewportHeight = page.viewport().height;
        let viewportIncr = 0;
        let loadMoreFlag = true;

        while (height < totalHeight) {
            while (viewportIncr + viewportHeight < (height - 1000)) {
                await page.evaluate(_viewportHeight => {
                    window.scrollBy(0, 300);
                }, viewportHeight);
                await wait(500);
                viewportIncr = viewportIncr + viewportHeight;
            }
            if (loadMoreFlag) {
                await page.click('.loadMoreButton');
                loadMoreFlag = false;
            }
            await wait(2000);
            height += 3000;
        }

        await wait(4000);

        var clothes = await page.evaluate(() => {
            var clothesArray = []

            var productName = document.querySelectorAll('.product-name');
            var prevPrice = document.querySelectorAll('.product-pricing');
            var imgLink = document.querySelectorAll('.primary-image');

            for (var i = 0; i < productName.length; i++) {

                var isDiscountExist = prevPrice[i].children[1] ? true : false;

                var percentDiscount = isDiscountExist ? (prevPrice[i].children[0].innerText.split("\n")[0].slice(1) - prevPrice[i].children[1].innerText.slice(1)) / prevPrice[i].children[0].innerText.split("\n")[0].slice(1) : false;

                console.log('Hello')

                clothesArray[i] = {
                    name: productName[i].innerText.trim(),
                    brand: "Madewell",
                    brandLogo: "https://brickworks-media-production.s3.amazonaws.com/logo/6/madewell-logo.png",
                    src: imgLink[i].getAttribute('src'),
                    link: productName[i].children[0].getAttribute('href'),
                    price: {
                        prev: isDiscountExist ? prevPrice[i].children[0].innerText.split("\n")[0] : false,
                        curr: isDiscountExist ? prevPrice[i].children[1].innerText : prevPrice[i].children[0].innerText.split("\n")[0],
                        discount: prevPrice[i].children[1] ? Math.floor(percentDiscount * 100) + "% off" : false
                    }
                }
            }
            return clothesArray
        })
        await browser.close();
        return clothes
    };

    scrape().then((value) => {
        insertDataIntoDB(value);
        res.send(value)
    })
})

module.exports = router;