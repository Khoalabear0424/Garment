var databaseUrl = "garmet_DB";
var collections = ["scrapedData", "savedItems"];
const mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

const insertDataIntoDB = (value) => {
    for (let i in value) {
        if (value[i].src) {
            db.scrapedData.insert({
                name: value[i].name,
                brand: value[i].brand,
                brandLogo: value[i].brandLogo,
                src: value[i].src,
                link: value[i].link,
                price: {
                    prev: value[i].price.prev,
                    curr: value[i].price.curr,
                    discount: value[i].price.discount
                }
            }, function (error, newItem) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Added item ${value[i].name}`);
                }
            })
        }
    }
}

module.exports = insertDataIntoDB;

