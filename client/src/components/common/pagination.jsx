import React from 'react';
import _ from 'lodash';

const Pagination = props => {
    const { itemsCount, pageSize, onPageChange, currentPage } = props;
    const pageCount = Math.ceil(itemsCount / pageSize);
    if (pageCount === 1) return null;
    const pages = _.range(1, pageCount + 1);

    return (
        <ul className="pagination">
            {pages.map((page, index) =>
                <li key={index} className={page === currentPage ? 'active page-item' : 'page-item'}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                </li>)}
        </ul>
    )
}

export default Pagination;