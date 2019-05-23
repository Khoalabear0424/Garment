const express = require('express');
const app = express();
const router = express.Router();
const mongojs = require("mongojs");

var databaseUrl = "garmet_DB";
var collections = ["nameTracker"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

router.get('/', function (req, res) {
    db.nameTracker.find({ 'word': { $nin: ["in", "Top", "The", "(Women)", "Stripe", "Edition", "&", "Madewell", "Wash:", "Mini", "x", "Whisper", "Tall", "Texture", "Tie-Front"] } }).sort({ 'count': -1 }).limit(30, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found)
        }
    });
})
module.exports = router;