import React from 'react';

const ListGroup = (props) => {
    const { onClickFilter, clothesTypesArray, selectedItem } = props;

    return <ul className="list-group">
        {clothesTypesArray.map((item, index) =>
            <li
                onClick={() => onClickFilter(item)}
                key={index}
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