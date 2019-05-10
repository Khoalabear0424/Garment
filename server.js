var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var databaseUrl = "scraper";
var collections = ["scrapedData", "savedItems"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});



//-------------------ROUTES----------------//

app.get("/", function (req, res) {
    db.scrapedData.find({
        "type": "news"
    }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('pages/home', {
                articles: found,
                pageTitle: "Home"
            });
        }
    });
});

app.get("/saved", function (req, res) {
    db.savedItems.find({
        "type": "news"
    }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('pages/saved', {
                pageTitle: "Saved Articles",
                articles: found,
            })
        }
    });
});

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

app.get("/scrape-shopping", function (req, res) {
    request('https://shop.nordstrom.com/c/all-womens-sale', function (error, response, body) {
        console.log('error:', error);
        const $ = cheerio.load(body);
        //res.send($('article').html())
        //entire article object for reference

        $('article').each(function (i, elem) {
            db.scrapedData.insert({
                name: $($($(this))).find('h3').children().children().text(),
                // description: $(this).find('h3').find('span').text(),
                src: $(this).find('div').find('img').attr('src'),
                link: 'https://shop.nordstrom.com' + $(this).find('a').attr('href'),
                price: {
                    prev: $($($(this))).find('div').eq(-2).children().last().text().split(" ")[0],
                    curr: $($($(this))).find('div').eq(-1).children().eq(-2).text().split(" ")[0],
                    discount: $($($(this))).find('div').eq(-1).children().last().html()
                },
                type: "shopping"
            }, function (error, newItem) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Added item ${i}`);
                }
            })
        })

        //THIS IS SPECIFIC TO NORDSTROM ONLY
        // prev res.send($($('article')[10]).find('div').eq(-2).children().last().html());
        // current price res.send($($('article')[10]).find('div').eq(-1).children().eq(-2).html());
        // discount res.send($($('article')[10]).find('div').eq(-1).children().last().html());
        // item name res.send($($('article')[0]).find('h3').children().children().text());

        //edge case
        // res.send($($('article')[50]).find('div').eq(-1).children().eq(-2).html().split(" ")[0]);
    })
})

app.get("/scrape-page", function (req, res) {
    request('https://www.nytimes.com/section/technology', function (error, response, body) {
        const $ = cheerio.load(body);
        $('article').each(function (i, elem) {
            if ($(this).find('p').html()) {
                db.scrapedData.insert({
                    title: $(this).find('h2').text(),
                    summary: $(this).find('p').text(),
                    link: 'https://www.nytimes.com' + $(this).find('a').attr('href'),
                    img: $(this).find('img').attr('src'),
                    type: "news"
                }, function (error, newArticle) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(`Added ${newArticle}`);
                    }
                })
            }
        })
    });
})


//----------------API----------------//

// Retrieve data from the db
app.get("/all-data", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});

app.post('/save-item', (req, res) => {
    console.log(req.body.item_id)
    db.scrapedData.find({
        "_id": mongojs.ObjectId(req.body.item_id)
    }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            db.savedItems.insert(found, function (error, savedItem) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Saved item ${savedItem}`);
                }
            })
        }
    });
})




// Listen on port 3000
app.listen(3001, function () {
    console.log("App running on port 3000!");
});
