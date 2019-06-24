var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];
const mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

const parseFloatAllCurrPrices = () => {
    console.log(`parsing float all prices`)
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            for (let i = 0; i < found.length; i++) {
                let parsedPrice = parseFloat(found[i].price.curr)
                db.scrapedData.update(
                    { _id: found[i]._id },
                    {
                        $set:
                        {
                            'price.curr': parsedPrice
                        }
                    }
                )
            }
        }
    });
}

module.exports = parseFloatAllCurrPrices;


