import React, { Component } from 'react';
import { getClothes } from '../services/testDB';
import Article from './Article';
import axios from 'axios';

class ArticleDisplay extends Component {
    state = {
        clothes: getClothes()
    }

    componentDidMount() {
        const promise = axios.get('http://localhost:3001/all-data');
        console.log(promise)
    }

    checkMethod = () => {
        console.log(this.state)
    }
    render() {
        return (
            <div>
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