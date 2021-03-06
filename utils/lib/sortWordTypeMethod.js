const mongojs = require("mongojs");

var databaseUrl = process.env.MONGODB_URI || "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

const sortWordTypeMethod = () => {
    console.log(`Sorting word type...`)
    db.typeCounter.find({
        'word': {
            $nin: ["(Nordstrom", "Exclusive)", "Size)", "Burch", "Tory", "Midi", "Front", "Plus", "Leith", "Jeans", "Navy", "Something", "Gibson", "Slide", "Skinny", "Waist", "High", "BP.", "J", "Wash", "Lace", "Sam", "Flat", "Edelman", "Ruffle", "Sleeve", "Eliza", "Crossbody", "Neck", "Topshop", "Wrap", "Halogen®", "Shoulder", "Linen", "Small", "Caslon®", "Ankle", "Blend", "the", "Rebecca", "Maxi", "Wide-Leg", "Mule", "Espadrille", "Button", "Minkoff", "Print", "Vince", "Society", "Emmett", "Long", "Toe", "Zella", "Faux", "UGG®", "Strap", "Blouse", "Camuto", "Relaxed", "Eco", "Rigid", "Petite", "Ruched", "Convertible", "Off", "Pump", "Sugarplum!", "Hi", "Camisole", "Minidress", "(Plus", "Women's", "International", "Day", "MARC", "JACOBS", "Button-Front", "High-Rise", "Mid-Rise", "9\"", "Short", "A-Line", "Slim", "Embroidered", "Knit", "Tunic", "Nordstrom", "Mesh", "All", "Halter", "Shift", "Sheath", "Crepe", "Easy", "(Women)", "&", "in", "(Regular", "Petite)", "The", "x", "Madewell", "Mini", "Edition", "Whisper", "Treasure", "Bond", "Bardot", "MCM", "Side", "Square", "Pocket", "Texture", "Thread", "Classic", "Scalloped", "Central", "Cami", "Silk", "Straw", "Bralette", "Swing", "Ribbed", "Tall", "Prairie", "Jansing", "Straight", "Stretch", "Pointy", "Back", "Sole", "by", "Leg", "BLANKNYC", "Weekend", "Fleming", "Chloé", "Favor", "Suede", "Lulus", "Pleat", "Platform", "Detail", "Knot", "Henley", "Fit", "Flip", "Flare", "Burberry", "Pleated", "Sleeveless", "Ravello", "Watch,", "Flap", "Double", "Split", "Bucket", "Canvas", "Metallic", "Pack", "Baker", "London", "Ted", "Wallet", "Nylon", "Corsage", "Boardwalk", "Vintage", "Rosalie", "Woven", "Summer", "Ruffle-Strap", "Ryder", "Pouch", "Confetti", "Lace-Up", "Crisscross", "Ruthie", "Bandana", "Delmar", "One-Piece", "Popover", "Chelsea", "Posies", "Socks", "Tie-Front", "Girls", "Graphic", "Women", "Inc.", "Muscle", "Windowpane", "Cheetah", "Rainbow", "Charles", "Smocked", "Henry", "ASTR", "Body-Con", "Label", "Rosi", "Distressed", "Signature", "Hazel", "7/8", "In", "Live", "Soft", "Jersey", "+", "Model", "Make", "Driving", "Madden", "Steve", "Low", "Boyfriend", "Wide", "Mary", "Faye", "Chiffon", "Peplum", "Heel", "Hinge", "Drape", "Row", "A", "Articles", "Ripped", "of", "Belted", "Everie", "(Regular,", "Quilted", "Trench", "Hem", "Cozy", "Colorblock", "Longchamp", "NYDJ", "Pullover", "MICHELE", "Cap", "Bateau", "38mm", "Everyday", "Off-White", "a", "Givenchy", "Wash:", "Denim", "Tie"]
        }, 'count': { $gte: 10 }
    }).sort({ 'count': -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            var wordCounterObj = {}
            for (let i in found) {
                wordCounterObj[found[i].word] = found[i].word
            }
            wordCounterObj["Jeans"] = "Jeans";
            wordCounterObj["Jeans:"] = "Jeans:";
            wordCounterObj["Minidress"] = "Minidress";
            wordCounterObj["Sundress"] = "Sundress";
            wordCounterObj["Miniskirt"] = "Miniskirt";
            wordCounterObj["Skirt:"] = "Skirt:";
            wordCounterObj["Flat"] = "Flat";
            wordCounterObj["Tunic"] = "Tunic";
            wordCounterObj["Shoe"] = "Shoe";
            wordCounterObj["Loafer"] = "Loafer";
            wordCounterObj["Trousers"] = "Trousers";
            wordCounterObj["Mule"] = "Mule";
            wordCounterObj["Pump"] = "Pump";
            wordCounterObj["Clog"] = "Clog";
            wordCounterObj["Blouse"] = "Blouse";
            wordCounterObj["Camisole"] = "Camisole";
            wordCounterObj["Pullover"] = "Pullover";
            wordCounterObj["Sweater-Coat"] = "Sweater-Coat";
            wordCounterObj["Bralette"] = "Bralette";
            wordCounterObj["Bootie"] = "Bootie";
            wordCounterObj["Slipper"] = "Slipper";
            wordCounterObj["Overalls"] = "Overalls";
            wordCounterObj["Coat"] = "Coat";
            wordCounterObj["Socks"] = "Socks";
            wordCounterObj["Shorts:"] = "Shorts:";
            wordCounterObj["Boyjean"] = "Boyjean";
            wordCounterObj["Boyjean:"] = "Boyjean:";
            wordCounterObj["Bralette"] = "Bralette";
            wordCounterObj["Sunglasses"] = "Sunglasses";
            wordCounterObj["Sneakers"] = "Sneakers";
            wordCounterObj["Bandana"] = "Bandana";
            wordCounterObj["Boots"] = "Boots";
            wordCounterObj["Hat"] = "Hat";
            wordCounterObj["Beanie"] = "Beanie";
            wordCounterObj["Sunhat"] = "Sunhat";
            wordCounterObj["Bodysuit"] = "Bodysuit";
            wordCounterObj["Romper"] = "Romper";
            wordCounterObj["Tights"] = "Sunhat";
            wordCounterObj["Sweater-Dress"] = "Sweater-Dress";
            wordCounterObj["Robe"] = "Robe";


            db.scrapedData.find({
                'type': { $exists: false }
            }, function (error, found) {
                if (error) {
                    console.log(error)
                } else {
                    for (let i in found) {
                        var name = found[i].name.split(" ");
                        for (let j in name) {
                            if (wordCounterObj[name[j]] && !found[i].type) {
                                db.scrapedData.update(
                                    { '_id': found[i]._id },
                                    {
                                        $set: {
                                            'type': wordCounterObj[name[j]]
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            })
        }
    })
}

module.exports = sortWordTypeMethod;

