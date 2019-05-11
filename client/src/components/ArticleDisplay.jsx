import React, { Component } from 'react';
import { getClothes } from '../services/scrapeClothesService';
import Article from './Article';

class ArticleDisplay extends Component {
    state = {
        clothes: []
    }

    async componentDidMount() {
        const { data: clothes } = await getClothes();
        this.setState({ clothes })
    }

    checkMethod = () => {
        console.log(this.state)
    }
    render() {
        return (
            <div>
                {console.log(this.state.clothes)}
                {this.state.clothes.map(a =>
                    <Article
                        key={a._id}
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