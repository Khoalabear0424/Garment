import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";

class Article extends Component {

    render() {

        const { name, imgSrc, link, prev, curr, discount } = this.props

        return (
            // <div className="container  m-4" data-id="1">
            <figure className="figure article m-4">
                <img src={imgSrc} className="figure-img img-fluid rounded" alt="" />
                <figcaption className="figure-caption">
                    <h6>
                        <a href={link} className="itemName">{name} </a>
                        <Like />
                    </h6>
                    <span className="originalPrice">{prev}</span>
                    <span className="price"> {curr} </span>
                    <span className="percentOff"> {discount} </span>
                </figcaption>
            </figure>
            // </ div>
        )
    }
}

export default Article;