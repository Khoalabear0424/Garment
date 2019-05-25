import React, { Component } from 'react';
import { getClothes, getClothesTypes, getType } from '../services/scrapeClothesService';
import Article from './Article';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import ListGroup from '../components/ListGroup';

class ArticleDisplay extends Component {
    state = {
        clothes: [],
        pageSize: 60,
        currentPage: 1,
        clothesTypes: ['Tops', 'Dresses', 'Pants', 'Shorts', 'Shoes']
    }

    async componentDidMount() {
        const { data: clothes } = await getClothes();
        // const { data: clothesTypes } = await getClothesTypes();
        // console.log(clothesTypes)
        this.setState({ clothes })
    }

    checkMethod = () => {
        console.log(this.state)
    }

    handlePageChange = page => {
        this.setState({ currentPage: page })
    }

    handleFilter = async (type) => {
        var { clothes } = this.state;
        getType(type).then((r) => {
            clothes = r;
            this.setState({ clothes })
        })
    }

    render() {
        const { length: count } = this.state.clothes;
        const { pageSize, currentPage, clothes: currentClothes, clothesTypes } = this.state;

        const currClothesArray = paginate(currentClothes, currentPage, pageSize)

        return (
            <div className="row">
                <div className="col-2">
                    <ListGroup
                        onClickFilter={this.handleFilter}
                        clothesTypesArray={clothesTypes}
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