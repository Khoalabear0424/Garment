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
    db.nameTracker.find({
        'word': {
            $nin: ["(Nordstrom", "Exclusive)", "Size)", "Burch", "Tory", "Midi", "Front", "Plus", "Leith", "Jeans", "Navy", "Something", "Gibson", "Slide", "Skinny", "Waist", "High", "BP.", "J", "Wash", "Lace", "Sam", "Flat", "Edelman", "Ruffle", "Sleeve", "Eliza", "Crossbody", "Neck", "Topshop", "Wrap", "Halogen®", "Shoulder", "Linen", "Small", "Caslon®", "Ankle", "Blend", "the", "Rebecca", "Maxi", "Wide-Leg", "Mule", "Espadrille", "Button", "Minkoff", "Print", "Vince", "Society", "Emmett", "Long", "Toe", "Zella", "Faux", "UGG®", "Strap", "Blouse", "Camuto", "Relaxed", "Eco", "Rigid", "Petite", "Ruched", "Convertible", "Off", "Pump", "Sugarplum!", "Hi", "Camisole", "Minidress", "(Plus", "Women's", "International", "Day", "MARC", "JACOBS", "Button-Front", "High-Rise", "Mid-Rise", "9\"", "Short", "A-Line", "Slim", "Embroidered", "Knit", "Tunic", "Nordstrom", "Mesh", "All", "Halter", "Shift", "Sheath", "Crepe", "Easy"]
        }
    }).sort({ 'count': -1 }).limit(120, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            var wordArr = []
            for (let i in found) {
                wordArr.push(found[i].word)
            }
            res.json(wordArr)
        }
    });
})
module.exports = router;