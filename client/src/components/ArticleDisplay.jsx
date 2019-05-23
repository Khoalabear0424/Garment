import React, { Component } from 'react';
import { getClothes } from '../services/scrapeClothesService';
import Article from './Article';
import Pagination from './common/pagination';

class ArticleDisplay extends Component {
    state = {
        clothes: [],
        pageSize: 10
    }

    async componentDidMount() {
        const { data: clothes } = await getClothes();
        console.log(clothes)
        this.setState({ clothes })
    }

    checkMethod = () => {
        console.log(this.state)
    }



    render() {
        const { length: count } = this.state.clothes;
        const { clothes, pageSize } = this.state;
        return (
            <div>
                {clothes.map(a =>
                    <Article
                        key={a._id}
                        name={a.name}
                        imgSrc={a.src}
                        link={a.link}
                        prev={a.price.prev}
                        curr={a.price.curr}
                        discount={a.price.discount}
                        brandLogo={a.brandLogo}
                        brand={a.brand}
                    />
                )}
                <div className="container">
                    <Pagination
                        itemsCount={count}
                        pageSize={pageSize}
                    // onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}


export default ArticleDisplay;