import React, { Component } from 'react';

class ListGroup extends Component {
    state = {
        priceFilterValue: '$ - $$'
    }

    priceFilter = () => {
        let { priceFilterValue } = this.state;
        if (priceFilterValue === '$ - $$') {
            priceFilterValue = '$$ - $'
        } else {
            priceFilterValue = '$ - $$'
        }
        this.setState({ priceFilterValue });
        return priceFilterValue;
    }

    render() {
        const { onClickFilter, clothesTypesArray, selectedItem, onPageChange, checkState } = this.props;
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
                onClick={() => onClickFilter(null, null, this.priceFilter())}>
                $ - $$
            </li>
        </ul>
    }
}

export default ListGroup;
