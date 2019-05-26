import React, { Component } from 'react';
import Article from './Article';
// import ListGroup from '../components/ListGroup';


const ArticleDisplay = props => {

    const { currClothesArray } = props;

    return (
        <div className="row">
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
        </div>
    );
}


export default ArticleDisplay;