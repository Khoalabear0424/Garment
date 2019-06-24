import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";

const discountPercentDisplay = (priceCurr, discount, name) => {
    console.log(`discount: ${discount}, itemName: ${name}, isFinite ${isFinite(discount)}`)

    return priceCurr ? discount + '%off' : false;
}

const dollarSignDisplayPrev = (price) => {
    let firstChar = price.slice(0, 1);
    if (firstChar !== "$") {
        return `$${price}`;
    }
    return price;
}

const dollarSignDisplayCurr = (price) => {
    if (!price) return null;
    return price ? "$" + price.toFixed(2) : "$" + price;
}

const priceFormatting = (pricePrev, priceCurr) => {
    if (!priceCurr) return "price"
    return "originalPrice"
}


class Article extends Component {
    render() {
        const { name, imgSrc, link, prev, curr, discount, brandLogo } = this.props

        return (
            <figure className="figure article m-3">
                <img src={imgSrc} className="figure-img img-fluid rounded" alt="" />
                <figcaption className="figure-caption">
                    <h6>
                        <a href={link} className="itemName">{name} </a>
                        {/* <Like /> */}
                    </h6>
                    <span className={priceFormatting(prev, curr)}>{dollarSignDisplayPrev(prev)}</span>
                    <span className="price"> {dollarSignDisplayCurr(curr)} </span>
                    <span className="percentOff">{discountPercentDisplay(curr, discount, name)} </span>
                    <img className="figure-img img-fluid rounded brand" src={brandLogo} alt="brandLogo" />
                </figcaption>
            </figure>
        )
    }
}

export default Article;