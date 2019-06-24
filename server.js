var express = require("express");
var mongojs = require("mongojs");
var app = express();
var bodyParser = require('body-parser');
var connectDB = require('./config/db');
var cors = require('cors');
var path = require('path');

connectDB();

require('dotenv').config()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))

//Init Middleware
app.use(express.json({ extended: false }));

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     next();
// });

var databaseUrl = process.env.MONGODB_URI || "garmet_DB";
var collections = ["scrapedData", "savedItems"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

//-------------------ROUTES----------------//



//----------------WEB SCRAPE--------------//
app.use('/scrape-nordStrom', require('./routes/scrape/nordstrom'));
app.use('/scrape-madeWell', require('./routes/scrape/madewell'));
app.use('/sort-word-type', require('./utils/lib/sortWordType'));


//----------------API----------------//
app.use('/parse-word-type', require('./routes/api/parseNames'));
app.use('/all-data', require('./routes/api/getAllData'));
app.use('/filter', require('./routes/api/filters'));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

//----------Listen on port 4001------------//
const port = process.env.PORT || 4001;
app.listen(port, function () {
    console.log(`App running on port ${port}!`);
});


