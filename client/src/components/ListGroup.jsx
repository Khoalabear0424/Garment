import React from 'react';

const ListGroup = (props) => {
    const { onClickFilter, clothesTypesArray, selectedItem, onPageChange } = props;

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
        <li className="list-group-item">
            $ - $$
        </li>
        <li className="list-group-item">
            % - %%
        </li>
    </ul>
};

export default ListGroup;