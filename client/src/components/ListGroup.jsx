import React from 'react';

const ListGroup = (props) => {
    const { onClickFilter, clothesTypesArray, selectedItem } = props;

    return <ul className="list-group">
        {clothesTypesArray.map((item, index) =>
            <li
                onClick={() => onClickFilter(item)}
                key={index}
                className={item === selectedItem ? 'list-group-item selected' : 'list-group-item'}>
                {item}
            </li>
        )}
    </ul>
};

export default ListGroup;