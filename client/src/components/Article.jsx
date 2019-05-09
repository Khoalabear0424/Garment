import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";
import { getClothes } from '../services/testDB';

class Article extends Component {
    state = {
        clothes: getClothes()
    }

    checkMethod = () => {
        console.log(this.state)
    }

    render() {
        return (
            <div className="container article m-4" data-id="1">
                <figure className="figure">
                    <img src="https://lp2.hm.com/hmgoepprod?set=source[/87/e0/87e0c05fc42ade2e753e6da605be865a6755b80b.jpg],origin[dam],category[ladies_knitwear_turtlenecks],type[LOOKBOOK],res[m],res[s],hmver[1]&call=url[file:/product/main]" className="figure-img img-fluid rounded" alt="" />
                    <figcaption className="figure-caption">
                        <h6>
                            <a href="#" className="itemName">Item Name  </a>
                            <Like />
                        </h6>
                        <span className="originalPrice">$12.00</span>
                        <span className="price">  $10.00 </span>
                        <span className="percentOff"> 15% </span>
                    </figcaption>
                </figure>
            </ div>
        )
    }
}

export default Article;