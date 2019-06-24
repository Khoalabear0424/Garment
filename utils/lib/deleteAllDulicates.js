const mongojs = require("mongojs");

var databaseUrl = process.env.MONGODB_URI || "garmet_DB";
var collections = ["scrapedData", "savedItems"];
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

const deleteAllDuplicates = () => {
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            let hash = {};
            let dup = [];
            for (let i of found) {
                if (hash[i.name]) {
                    dup.push({
                        '_id': i._id,
                        'name': i.name
                    })
                }
                else {
                    hash[i.name] = true;
                }
            }

            for (let i of dup) {
                db.scrapedData.remove(
                    { '_id': i._id }
                )
            }
            console.log(dup);
        }
    });
}

module.exports = deleteAllDuplicates;


