import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";

class Article extends Component {

    render() {
        return (
            // <div className="container  m-4" data-id="1">
            <figure className="figure article m-4">
                <img src={this.props.imgSrc} className="figure-img img-fluid rounded" alt="" />
                <figcaption className="figure-caption">
                    <h6>
                        <a href="#" className="itemName">{this.props.name} </a>
                        <Like />
                    </h6>
                    <span className="originalPrice">$12.00</span>
                    <span className="price">  $10.00 </span>
                    <span className="percentOff"> 15% </span>
                </figcaption>
            </figure>
            // </ div>
        )
    }
}

export default Article;