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

router.get('/:type/:brand/:price', function (req, res) {
    const type = req.params.type;
    const brand = req.params.brand;
    const price = req.params.price;

    console.log(`type=${type}, brand=${brand}, price=${price}`)

    const clothesTypeLookUp = {
        'Tops': ['Top', 'V-Neck', 'Shirt', 'Blouse', 'Camisole', 'Overalls', 'Bodysuit'],
        'Dresses': ['Dress', 'Floral', 'Skirt', 'MiniDress', 'Sundress', 'Minidress', 'Romper', 'Sweater-Dress'],
        'Jackets': ['Jacket', 'Coat', 'Cardigan', 'Tunic', 'Pullover', 'Sweater-Coat'],
        'Pants': ['Pants', 'Jeans', 'Trousers', 'Jeans:', 'Boyjean', 'Boyjean:'],
        'Shorts': ['Shorts', 'Miniskirt', 'Skirt:', 'Shorts:'],
        'Shoes': ['Flat', 'Slip-On', 'Vans', 'Shoe', 'Loafer', 'Mule', 'Pump', 'Clog', 'Sneakers', 'Slipper', 'Bootie', 'Boots'],
        'Accessories': ['Sunglasses', 'Bandana', 'Socks', 'Hat', 'Sunhat', 'Beanie', 'Tights', 'Robe']
    }

    const clothesPriceLookUp = {
        'null': 1,
        '$ - $$': -1,
        '$$ - $': 1
    }

    let filterPrice = clothesPriceLookUp[price];

    db.scrapedData.find({
        'type': clothesTypeLookUp[type] ? { $in: clothesTypeLookUp[type] } : { $exists: false },
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


// //-----------------DELETE ALL DUPLICATES-----------------//
// db.scrapedData.find({}, function (error, found) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         let hash = {};
//         let dup = [];
//         for (let i of found) {
//             if (hash[i.name]) {
//                 dup.push({
//                     '_id': i._id,
//                     'name': i.name
//                 })
//             }
//             else {
//                 hash[i.name] = true;
//             }
//         }

//         for (let i of dup) {
//             db.scrapedData.remove(
//                 { '_id': i._id }
//             )
//         }
//         console.log(dup);
//     }
// });

//-----------------PARSE FLOAT ALL CURRENT PRICES-----------------//
// db.scrapedData.find({}, function (error, found) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         for (let i = 0; i < found.length; i++) {
//             let parsedPrice = parseFloat(found[i].price.curr)
//             db.scrapedData.update(
//                 { _id: found[i]._id },
//                 {
//                     $set:
//                     {
//                         'price.curr': parsedPrice
//                     }
//                 }
//             )
//         }
//     }
// });

