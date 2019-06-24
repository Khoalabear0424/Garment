import React, { Component } from 'react';

class ListGroup extends Component {
    render() {
        const { onClickFilter, clothesTypesArray, selectedItem, priceFilterValue, onClickPriceFilter } = this.props;
        return <ul className="list-group">
            {clothesTypesArray.map((item, index) =>
                <li
                    onClick={() => onClickFilter(item)}
                    key={index}
                    className={item === selectedItem ? 'list-group-item selected-link' : 'list-group-item'}>
                    {item}
                </li>
            )}
            <br></br>
            <li className="list-group-item"
                onClick={() => onClickFilter(null, null, onClickPriceFilter())}>
                {priceFilterValue}
            </li>
        </ul>
    }
}

export default ListGroup;
