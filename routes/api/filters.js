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
        'Tops': ['Top', 'V-Neck', 'Shirt', 'Blouse', 'Camisole', 'Overalls', 'Bodysuit'],
        'Dresses': ['Dress', 'Floral', 'Skirt', 'MiniDress', 'Sundress', 'Minidress', 'Romper', 'Sweater-Dress'],
        'Jackets': ['Jacket', 'Coat', 'Cardigan', 'Tunic', 'Pullover', 'Sweater-Coat'],
        'Pants': ['Pants', 'Jeans', 'Trousers', 'Jeans:', 'Boyjean', 'Boyjean:'],
        'Shorts': ['Shorts', 'Miniskirt', 'Skirt:', 'Shorts:'],
        'Shoes': ['Flat', 'Slip-On', 'Vans', 'Shoe', 'Loafer', 'Mule', 'Pump', 'Clog', 'Sneakers', 'Slipper', 'Bootie', 'Boots'],
        'Accessories': ['Sunglasses', 'Bandana', 'Socks', 'Hat', 'Sunhat', 'Beanie', 'Tights', 'Robe']
    }

    // db.scrapedData.find({}).sort({ 'price.discount': 1 }, function (error, found) {
    //     if (error) {
    //         console.log(error);
    //     }
    //     else {
    //         res.json(found)
    //     }
    // });

    db.scrapedData.find({
        'type': clothesTypeLookUp[type] ? { $in: clothesTypeLookUp[type] } : { $exists: false }
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