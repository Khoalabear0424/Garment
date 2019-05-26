import React from 'react';

const ListGroup = (props) => {
    const { onClickFilter, clothesTypesArray, selectedItem } = props;

    return <ul className="list-group m-4 position-fixed">
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

export default ListGroup;