const express = require('express');
const app = express();
const router = express.Router();
const mongojs = require("mongojs");

var databaseUrl = process.env.MONGODB_URI || "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

router.get('/:type/:brand/:price', function (req, res) {
    const type = req.params.type;
    const brand = req.params.brand;
    const price = req.params.price;

    console.log(`type=${type}, brand=${brand}, price=${price}`)

    const clothesTypeLookUp = {
        'Tops': ['Top', 'V-Neck', 'Shirt', 'Blouse', 'Camisole', 'Overalls', 'Bodysuit', 'Shirtdress', 'Jumpsuit', 'Bra'],
        'Dresses': ['Blouse', 'Dress', 'Floral', 'Skirt', 'MiniDress', 'Sundress', 'Minidress', 'Romper', 'Sweater-Dress', 'Gown'],
        'Jackets': ['Jacket', 'Coat', 'Cardigan', 'Tunic', 'Pullover', 'Sweater-Coat'],
        'Pants': ['Pants', 'Jeans', 'Trousers', 'Jeans:', 'Boyjean', 'Boyjean:'],
        'Shorts': ['Shorts', 'Miniskirt', 'Skirt:', 'Shorts:'],
        'Shoes': ['Flat', 'Slip-On', 'Vans', 'Shoe', 'Loafer', 'Mule', 'Pump', 'Clog', 'Sneakers', 'Slipper', 'Bootie', 'Boots', 'Sandal', 'Wedge'],
        'Accessories': ['Earrings', 'Necklace', 'Sunglasses', 'Bandana', 'Socks', 'Hat', 'Sunhat', 'Beanie', 'Tights', 'Robe', 'Bag', 'Backpack', 'Tote', 'Leggings']
    }

    const clothesPriceLookUp = {
        'null': 1,
        '$ - $$': 1,
        '$$ - $': -1
    }

    let filterPrice = clothesPriceLookUp[price];

    db.scrapedData.find({
        'type': clothesTypeLookUp[type] ? { $in: clothesTypeLookUp[type] } : type === 'All' ? { $exists: true } : { $exists: false },
        'brand': brand === 'null' ? { $exists: true } : brand
    }).sort({
        'price.curr': filterPrice
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


