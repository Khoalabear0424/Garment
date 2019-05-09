import React, { Component } from 'react';
import '../App.css';
import Like from "./common/like";

class Article extends Component {
    state = {}

    render() {
        return (
            <div className="container article m-4" data-id="1">
                <figure class="figure">
                    <img src="https://lp2.hm.com/hmgoepprod?set=source[/87/e0/87e0c05fc42ade2e753e6da605be865a6755b80b.jpg],origin[dam],category[ladies_knitwear_turtlenecks],type[LOOKBOOK],res[m],res[s],hmver[1]&call=url[file:/product/main]" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure." />
                    <figcaption class="figure-caption">
                        <h6>
                            <a href="<%= data[i].link %>" className="itemName">Item Name  </a>
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