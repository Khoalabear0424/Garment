const express = require('express');
const app = express();
const router = express.Router();
const mongojs = require("mongojs");

var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

router.get('/', function (req, res) {
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
            res.json(name)
        }
    });
})

module.exports = router;