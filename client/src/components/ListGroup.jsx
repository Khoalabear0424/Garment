import React from 'react';

const ListGroup = (props) => {
    const { onClickTops, items, textProperty, valueProperty, onItemSelect, selectedItem } = props;

    return <ul className="list-group">
        <li className="list-group-item" onClick={onClickTops}>Tops</li>
        <li className="list-group-item">Dresses</li>
        <li className="list-group-item">Jeans</li>
        <li className="list-group-item">Skirts</li>
        <li className="list-group-item">Shoes</li>
        {/* {items.map(item =>
            <li
                onClick={() => onItemSelect(item)}
                key={item[valueProperty]}
                className={item === selectedItem ? 'list-group-item active' : 'list-group-item'}>{item[textProperty]}
            </li>
        )} */}
    </ul>
};

ListGroup.defaultProps = {
    textProperty: 'name',
    valueProperty: '_id'
}


export default ListGroup;