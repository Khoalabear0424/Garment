import React, { Component } from 'react';
import { getClothes, getClothesTypes } from '../services/scrapeClothesService';
import Article from './Article';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import ListGroup from '../components/ListGroup';

class ArticleDisplay extends Component {
    state = {
        clothes: [],
        pageSize: 60,
        currentPage: 1,
        clothesTypes: {}
    }

    async componentDidMount() {
        const { data: clothes } = await getClothes();
        const { data: clothesTypes } = await getClothesTypes();
        console.log(clothes)
        console.log(clothesTypes)
        this.setState({ clothes, clothesTypes })
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
            <div className="row">
                <div className="col-2">
                    <ListGroup

                    />
                </div>
                <div className="col-10">
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
                </div>
            </div>
        );
    }
}


export default ArticleDisplay;