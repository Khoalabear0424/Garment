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
    request('https://shop.nordstrom.com/c/all-womens-sale', function (error, response, body) {
        const $ = cheerio.load(body);

        $('article').each(function (i, elem) {
            db.scrapedData.insert({
                name: $($($(this))).find('h3').children().children().text(),
                brand: "Nordstrom",
                brandLogo: "https://brickworks-media-production.s3.amazonaws.com/logo/6/madewell-logo.png",
                src: $(this).find('div').find('img').attr('src'),
                link: 'https://shop.nordstrom.com' + $(this).find('a').attr('href'),
                price: {
                    prev: $($($(this))).find('div').eq(-2).children().last().text().split(" ")[0],
                    curr: $($($(this))).find('div').eq(-1).children().eq(-2).text().split(" ")[0],
                    discount: $($($(this))).find('div').eq(-1).children().last().html()
                }
            }, function (error, newItem) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Added item ${i}`);
                }
            })
        })
    })
})

app.get("/scrape-madeWell", function (req, res) {
    let scrape = async () => {
        var browser = await puppeteer.launch({ headless: false });
        var page = await browser.newPage();

        await page.goto('https://www.madewell.com/womens/sale');
        // await page.waitForSelector('.ui-button');

        const [popup] = await Promise.all([
            new Promise(resolve => page.once('popup', resolve)),
            page.click('.ui-button'),
        ]);

        // Get the height of the rendered page
        const bodyHandle = await page.$('body');
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        // Scroll one viewport at a time, pausing to let content load
        const viewportHeight = page.viewport().height;
        let viewportIncr = 0;
        while (viewportIncr + viewportHeight < height) {
            await page.evaluate(_viewportHeight => {
                window.scrollBy(0, _viewportHeight);
            }, viewportHeight);
            await wait(20);
            viewportIncr = viewportIncr + viewportHeight;
        }

        // Scroll back to top
        await page.evaluate(_ => {
            window.scrollTo(0, 0);
        });

        // Some extra delay to let images load
        await wait(100);

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
                    brandLogo: "https://cblproperty.blob.core.windows.net/production/assets/blt9984adfdc47a0340-Madewell_logo.png",
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
        for (var i in value) {
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
                    console.log(`Added item ${i}`);
                }
            })
        }
        res.send(value)
    })


    // puppeteer.launch({ headless: false }).then(async browser => {
    //     const page = await browser.newPage();
    //     page
    //         .waitForSelector('img')
    //         .then(() => {
    //             console.log('Success')
    //             var productName = document.querySelectorAll('.product-tile-details');
    //             console.log(productName)
    //         });
    //     await page.goto("https://www.madewell.com/womens/sale");

    //     await browser.close();
    // });
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
