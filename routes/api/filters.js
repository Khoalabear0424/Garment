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

router.get('/:type', function (req, res) {
    const type = req.params.type
    const clothesTypeLookUp = {
        'Tops': ['Top', 'V-Neck', 'Shirt'],
        'Dresses': ['Dress', 'Floral', 'Skirt', 'MiniDress', 'Sundress'],
        'Jackets': ['Jacket', 'Coat', 'Cardigan'],
        'Pants': ['Pants', 'Jeans'],
        'Shorts': ['Shorts'],
        'Shoes': ['Flat', 'Slip-On', 'Vans']
    }
    db.scrapedData.find({
        'type': { $in: clothesTypeLookUp[type] }
    }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found)
        }
    });
})

module.exports = router;