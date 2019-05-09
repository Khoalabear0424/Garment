import React, { Component } from 'react';
import { getClothes } from '../services/testDB';
import Article from './Article';

class ArticleDisplay extends Component {
    state = {
        clothes: getClothes()
    }

    checkMethod = () => {
        console.log(this.state)
    }
    render() {
        return (
            <div>
                {this.state.clothes.map(a =>
                    <Article
                        name={a.name}
                        imgSrc={a.src}
                        link={a.link}
                        prev={a.price.prev}
                        curr={a.price.curr}
                        discount={a.price.discount}
                    />
                )}
            </div>
        );
    }
}

export default ArticleDisplay;