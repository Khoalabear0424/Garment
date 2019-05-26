import React from 'react';
import _ from 'lodash';

const Pagination = props => {
    const { itemsCount, pageSize, onPageChange, currentPage } = props;
    const pageCount = Math.ceil(itemsCount / pageSize);
    if (pageCount === 1) return null;
    const pages = _.range(1, pageCount + 1);

    return (
        <ul className="pagination justify-content-center">
            {pages.map((page, index) =>
                <li
                    key={index}
                    className={page === currentPage ? 'selected-link pagination-item' : 'pagination-item'}
                    onClick={() => onPageChange(page)}>
                    {page}
                </li>)}
        </ul>
    )
}

export default Pagination;