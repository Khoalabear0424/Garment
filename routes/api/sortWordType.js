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
            $nin: ["(Nordstrom", "Exclusive)", "Size)", "Burch", "Tory", "Midi", "Front", "Plus", "Leith", "Jeans", "Navy", "Something", "Gibson", "Slide", "Skinny", "Waist", "High", "BP.", "J", "Wash", "Lace", "Sam", "Flat", "Edelman", "Ruffle", "Sleeve", "Eliza", "Crossbody", "Neck", "Topshop", "Wrap", "Halogen®", "Shoulder", "Linen", "Small", "Caslon®", "Ankle", "Blend", "the", "Rebecca", "Maxi", "Wide-Leg", "Mule", "Espadrille", "Button", "Minkoff", "Print", "Vince", "Society", "Emmett", "Long", "Toe", "Zella", "Faux", "UGG®", "Strap", "Blouse", "Camuto", "Relaxed", "Eco", "Rigid", "Petite", "Ruched", "Convertible", "Off", "Pump", "Sugarplum!", "Hi", "Camisole", "Minidress", "(Plus", "Women's", "International", "Day", "MARC", "JACOBS", "Button-Front", "High-Rise", "Mid-Rise", "9\"", "Short", "A-Line", "Slim", "Embroidered", "Knit", "Tunic", "Nordstrom", "Mesh", "All", "Halter", "Shift", "Sheath", "Crepe", "Easy", "(Women)", "&", "in", "(Regular", "Petite)", "The", "x", "Madewell", "Mini", "Edition", "Whisper", "Treasure", "Bond", "Bardot", "MCM", "Side", "Square", "Pocket", "Texture", "Thread", "Classic", "Scalloped", "Central", "Cami", "Silk", "Straw", "Bralette", "Swing", "Ribbed", "Tall", "Prairie", "Jansing", "Straight", "Stretch", "Pointy", "Back", "Sole", "by", "Leg", "BLANKNYC", "Weekend", "Fleming", "Chloé", "Favor", "Suede", "Lulus", "Pleat", "Platform", "Detail", "Knot", "Henley", "Fit", "Flip", "Flare", "Burberry", "Pleated", "Sleeveless", "Ravello", "Watch,", "Flap", "Double", "Split", "Bucket", "Canvas", "Metallic", "Pack", "Baker", "London", "Ted", "Wallet", "Nylon", "Corsage", "Boardwalk", "Vintage", "Rosalie", "Woven", "Summer", "Ruffle-Strap", "Ryder", "Pouch", "Confetti", "Lace-Up", "Crisscross", "Ruthie", "Bandana", "Delmar", "One-Piece", "Popover", "Chelsea", "Posies", "Socks", "Tie-Front", "Girls", "Graphic", "Women", "Inc.", "Muscle", "Windowpane", "Cheetah", "Rainbow", "Charles", "Smocked", "Henry", "ASTR", "Body-Con", "Label", "Rosi", "Distressed", "Signature", "Hazel", "7/8", "In", "Live", "Soft", "Jersey", "+", "Model", "Make", "Driving", "Madden", "Steve", "Low", "Boyfriend", "Wide", "Mary", "Faye", "Chiffon", "Peplum", "Heel", "Hinge", "Drape", "Row", "A", "Articles", "Ripped", "of", "Belted", "Everie", "(Regular,", "Quilted", "Trench", "Hem", "Cozy", "Colorblock", "Longchamp", "NYDJ", "Pullover", "MICHELE", "Cap", "Bateau", "38mm", "Everyday", "Off-White", "a", "Givenchy", "Wash:", "Denim", "Tie"]
        }, 'count': { $gte: 10 }
    }).sort({ 'count': -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            var wordArr = {}
            for (let i in found) {
                wordArr[found[i].word] = found[i].word
            }
            wordArr["Jeans"] = "Jeans";
            wordArr["MiniDress"] = "MiniDress";
            wordArr["Flat"] = "Flat";
            res.json(wordArr)
        }
    });
})
module.exports = router;