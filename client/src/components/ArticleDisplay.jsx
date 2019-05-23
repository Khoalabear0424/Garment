import React, { Component } from 'react';
import { getClothes } from '../services/scrapeClothesService';
import Article from './Article';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';

class ArticleDisplay extends Component {
    state = {
        clothes: [],
        pageSize: 10,
        currentPage: 1
    }

    async componentDidMount() {
        const { data: clothes } = await getClothes();
        console.log(clothes)
        this.setState({ clothes })
    }

    checkMethod = () => {
        console.log(this.state)
    }

    handlePageChange = page => {
        this.setState({ currentPage: page })
    }


    render() {
        const { length: count } = this.state.clothes;
        const { clothes, pageSize, currentPage, clothes: currentClothes } = this.state;

        const currClothesArray = paginate(currentClothes, currentPage, pageSize)

        return (
            <div>
                {currClothesArray.map(a =>
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
                        onPageChange={this.handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        );
    }
}


export default ArticleDisplay;