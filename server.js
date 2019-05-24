var express = require("express");
var mongojs = require("mongojs");
var app = express();
var bodyParser = require('body-parser');

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



//----------------WEB SCRAPE--------------//
app.use('/scrape-nordStrom', require('./routes/scrape/nordstrom'));
app.use('/scrape-madeWell', require('./routes/scrape/madewell'));


//----------------API----------------//
app.use('/sort-word-type', require('./routes/api/sortWordType'));
app.use('/parse-word-type', require('./routes/api/parseNames'));
app.use('/all-data', require('./routes/api/getAllData'));
app.use('/filter-tops', require('./routes/api/filters'));


//----------Listen on port 3001------------//
app.listen(3001, function () {
    console.log("App running on port 3001!");
});
