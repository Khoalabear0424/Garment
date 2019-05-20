function insertDataIntoDB(value) {
    for (var i in value) {
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

