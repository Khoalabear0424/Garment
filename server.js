var express = require("express");
var mongojs = require("mongojs");
var app = express();
var bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Init Middleware
app.use(express.json({ extended: false }));

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

app.use('/scrape-nordStrom', require('./routes/scrape/nordstrom'));
app.use('/scrape-madeWell', require('./routes/scrape/madewell'));



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
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            var hash = {}
            var name = [];
            for (let i = 0; i < found.length; i++) {
                name.push(found[i].name.split(" "))
            }
            for (let i in name) {
                for (let j in name[i]) {
                    hash[name[i][j]] = (hash[name[i][j]] || 0) + 1;
                }
            }

            for (let i in hash) {
                db.nameTracker.insert({
                    word: i,
                    count: hash[i]
                }, function (error, newItem) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(`Added item ${Object.keys(hash)[i]}`);
                    }
                })
            }
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
