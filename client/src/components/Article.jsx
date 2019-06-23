import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";

const discountPercentDisplay = (discount, name) => {
    console.log(`discount: ${discount}, itemName: ${name}, isFinite ${isFinite(discount)}`)
    return discount ? '%off' : false;
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
                        <Like />
                    </h6>
                    <span className="originalPrice">${prev}</span>
                    <span className="price"> ${curr ? curr.toFixed(2) : curr} </span>
                    <span className="percentOff"> {discount}{discountPercentDisplay(discount, name)} </span>
                    <img className="figure-img img-fluid rounded brand" src={brandLogo} alt="brandLogo" />
                </figcaption>
            </figure>
        )
    }
}

export default Article;