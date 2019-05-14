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
    async function scrape() {
        function wait(ms) {
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        }

        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto('https://shop.nordstrom.com/c/all-womens-sale');

        // Get the height of the rendered page
        let bodyHandle = await page.$('body');
        let { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        // Scroll one viewport at a time, pausing to let content load
        const viewportHeight = 500
        let viewportIncr = 0;
        let pages = 0;

        while (pages < 3) {
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
                        brand: "Nordstrom",
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
            await page.click('.nui-icon-large-chevron-right');
            await wait(3000);
            viewportIncr = 0
            bodyHandle = await page.$('body');
            pages++
        }
        res.send(data)
        insertDataIntoDB(data)
        await browser.close();
    };

    function insertDataIntoDB(value) {
        for (let i in value) {
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

    scrape()
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
        let totalHeight = height * 2;
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

app.get("/word-type", function (req, res) {
    db.nameTracker.find({ 'word': { $nin: ["in", "Top", "The", "(Women)", "Stripe", "Edition", "&", "Madewell", "Wash:", "Mini", "x", "Whisper", "Tall", "Texture", "Tie-Front"] } }).sort({ 'count': -1 }).limit(30, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found)
        }
    });
})

app.get("/all-data", function (req, res) {
    db.nameTracker.drop()
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            // var hash = {}
            // var name = [];
            // for (let i = 0; i < 284; i++) {
            //     name.push(found[i].name.split(" "))
            // }
            // for (let i in name) {
            //     for (let j in name[i]) {
            //         hash[name[i][j]] = (hash[name[i][j]] || 0) + 1;
            //     }
            // }

            // for (let i in hash) {
            //     db.nameTracker.insert({
            //         word: i,
            //         count: hash[i]
            //     }, function (error, newItem) {
            //         if (error) {
            //             console.log(error)
            //         } else {
            //             console.log(`Added item ${Object.keys(hash)[i]}`);
            //         }
            //     })
            // }
            res.json(found)
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
