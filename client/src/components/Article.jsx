import React, { Component } from 'react';
import '../App.css';

class Article extends Component {
    state = {}

    render() {
        return (
            <div className="container article m-4" data-id="1">
                <div className="jumbotron" >
                    <img className="itemImage" src="https://lp2.hm.com/hmgoepprod?set=source[/87/e0/87e0c05fc42ade2e753e6da605be865a6755b80b.jpg],origin[dam],category[ladies_knitwear_turtlenecks],type[LOOKBOOK],res[m],res[s],hmver[1]&call=url[file:/product/main]" alt="Image Item" />
                    <a href="<%= data[i].link %>">
                        <h5>Item Name</h5>
                    </a>
                    <p className="priceDisplay"><span className="originalPrice">
                        $12.00</span><span className="price">
                            $10.00 </span> <span className="percentOff">
                            15%</span> <button className="btn-success btn btn-sm" data-id="<1>">Save</button>
                    </p>

                    <figure class="figure">
                        <img src="..." class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
                            <figcaption class="figure-caption">A caption for the above image.</figcaption>
                    </figure>
                    
                </ div>
                </ div>
                )
            }
        }
        
export default Article;