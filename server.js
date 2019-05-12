var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});


//-------------------ROUTES----------------//

// app.get("/", function (req, res) {
//     db.scrapedData.find({
//         "type": "news"
//     }, function (error, found) {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             res.render('pages/home', {
//                 articles: found,
//                 pageTitle: "Home"
//             });
//         }
//     });
// });

// app.get("/saved", function (req, res) {
//     db.savedItems.find({
//         "type": "news"
//     }, function (error, found) {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             res.render('pages/saved', {
//                 pageTitle: "Saved Articles",
//                 articles: found,
//             })
//         }
//     });
// });

app.get("/shopping", (req, res) => {
    db.scrapedData.find({
        "type": "shopping"
    }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('pages/shopping', {
                pageTitle: "Shopping",
                data: found,
            })
        }
    });
})


//----------------WEB SCRAPE--------------//

app.get("/scrape-nordStrom", function (req, res) {
    let scrape = async () => {
        function wait(ms) {
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        }

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://shop.nordstrom.com/c/all-womens-sale');
        await page.waitForSelector('.nui-icon');

        const bodyHandle = await page.$('body');
        const html = await page.evaluate(body => body.innerHTML, bodyHandle);
        await bodyHandle.dispose();

        await page.evaluate(body => {
            var clothesArray = []
            $ = cheerio.load(body);
            res.send($('article'));

            // var product = document.querySelectorAll('article');
            // var imgLink = document.querySelectorAll('img');
            // var productName = document.querySelectorAll('article > h3 > a > span > span');
            // var nameLink = document.querySelectorAll('article > div > a');
            // var price = document.querySelector('article > h3')

            // for (let i = 0; i < price.length; i++) {
            //     // var productLength = product[i].childElementCount == 4 ? 5 : product[i].childElementCount;
            //     clothesArray[i] = {
            //         name: productName[i].innerText,
            //         src: imgLink[i].getAttribute('src'),
            //         link: nameLink[i].getAttribute('href'),
            //         prev: price[0].nextSibling.innerText
            //     }
            // }

            // return clothesArray
        })
        await wait(2000);
        await browser.close();
        // return clothes
    };

    scrape().then((value) => {
        for (let i in value) {
            console.log(value[i].prev)
        }
        res.json(value)
    });
    // request('https://shop.nordstrom.com/c/all-womens-sale', function (error, response, body) {
    //     const $ = cheerio.load(body);

    //     $('article').each(function (i, elem) {
    //         db.scrapedData.insert({
    //             name: $($($(this))).find('h3').children().children().text(),
    //             brand: "Nordstrom",
    //             brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nordstrom_Logo.svg/1280px-Nordstrom_Logo.svg.png",
    //             src: $(this).find('div').find('img').attr('src'),
    //             link: 'https://shop.nordstrom.com' + $(this).find('a').attr('href'),
    //             price: {
    //                 prev: $($($(this))).find('div').eq(-2).children().last().text().split(" ")[0],
    //                 curr: $($($(this))).find('div').eq(-1).children().eq(-2).text().split(" ")[0],
    //                 discount: $($($(this))).find('div').eq(-1).children().last().html()
    //             }
    //         }, function (error, newItem) {
    //             if (error) {
    //                 console.log(error)
    //             } else {
    //                 console.log(`Added item ${i}`);
    //             }
    //         })
    //     })
    // })
})

app.get("/scrape-madeWell", function (req, res) {
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
        let totalHeight = height * 10;
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
                await wait(100);
                viewportIncr = viewportIncr + viewportHeight;
            }
            if (loadMoreFlag) {
                await page.click('.loadMoreButton');
                loadMoreFlag = false;
            }
            await wait(3000);
            height += 3000;
        }

        await wait(500);

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
        for (let i in value) {
            if (value[i].src) {
                db.scrapedData.insert({
                    name: value[i].name,
                    brand: value[i].brand,
                    brandLogo: value[i].brandLogo,
                    src: value[i].src,
                    link: value[i].link,
                    price: {
                        prev: value[i].price.prev,
                        curr: value[i].price.curr,
                        discount: value[i].price.discount
                    }
                }, function (error, newItem) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(`Added item ${value[i].name}`);
                    }
                })
            }
        }
        res.send(value)
    })
})



//----------------API----------------//

app.get("/all-data", function (req, res) {
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

// app.post('/save-item', (req, res) => {
//     console.log(req.body.item_id)
//     db.scrapedData.find({
//         "_id": mongojs.ObjectId(req.body.item_id)
//     }, function (error, found) {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             db.savedItems.insert(found, function (error, savedItem) {
//                 if (error) {
//                     console.log(error)
//                 } else {
//                     console.log(`Saved item ${savedItem}`);
//                 }
//             })
//         }
//     });
// })




// Listen on port 3001
app.listen(3001, function () {
    console.log("App running on port 3001!");
});
