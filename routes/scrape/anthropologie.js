const express = require('express');
const app = express();
const router = express.Router();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var mongojs = require("mongojs");
const insertDataIntoDB = require('../../utils/lib/insertIntoDB');


var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

var pagesToScrape = 1;

router.get('/', function (req, res) {
    async function scrape() {
        function wait(ms) {
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        }

        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto('https://www.anthropologie.com/sale-all');

        // Get the height of the rendered page
        let bodyHandle = await page.$('body');
        let { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        // Scroll one viewport at a time, pausing to let content load
        const viewportHeight = height
        let viewportIncr = 0;
        let pages = 0;

        while (pages < pagesToScrape) {
            while (viewportIncr + viewportHeight < 27500) {
                await page.evaluate(_viewportHeight => {
                    window.scrollBy(0, 300);
                }, viewportHeight);
                await wait(50);
                viewportIncr = viewportIncr + viewportHeight;
            }
            let content = await page.content();
            var $ = cheerio.load(content);
            var data = []
            $('article').each(function (i, elem) {
                data[i] =
                    {
                        name: $($($(this))).find('h3').children().children().text(),
                        brand: "Anthropologie",
                        brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nordstrom_Logo.svg/1280px-Nordstrom_Logo.svg.png",
                        src: $(this).find('div').find('img').attr('src'),
                        link: 'https://shop.nordstrom.com' + $(this).find('a').attr('href'),
                        price: {
                            prev: $($($(this))).find('div').eq(-2).children().last().text().split(" ")[0],
                            curr: $($($(this))).find('div').eq(-1).children().eq(-2).text().split(" ")[0],
                            discount: $($($(this))).find('div').eq(-1).children().last().html()
                        }

                    }
            })
            // insertDataIntoDB(data)
            await wait(3000);
            await page.click('.nui-icon-large-chevron-right');
            viewportIncr = 0
            bodyHandle = await page.$('body');
            pages++
        }
        res.send(data)
        await browser.close();
    };

    scrape()
})

module.exports = router;