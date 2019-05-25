import React from 'react';

const ListGroup = (props) => {
    const { onClickFilter, clothesTypesArray, items, textProperty, valueProperty, onItemSelect, selectedItem } = props;

    return <ul className="list-group">
        {/* <li className="list-group-item" onClick={() => onClickFilter('Top')}>Tops</li>
        <li className="list-group-item">Dresses</li>
        <li className="list-group-item">Jeans</li>
        <li className="list-group-item">Skirts</li>
        <li className="list-group-item">Shoes</li> */}
        {clothesTypesArray.map(item =>
            <li
                onClick={() => onClickFilter(item)}
                key={item[valueProperty]}
                className={item === selectedItem ? 'list-group-item active' : 'list-group-item'}>
                {item}
            </li>
        )}
    </ul>
};

ListGroup.defaultProps = {
    textProperty: 'name',
    valueProperty: '_id'
}


export default ListGroup;