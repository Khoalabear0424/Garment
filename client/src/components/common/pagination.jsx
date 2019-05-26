import React from 'react';
import _ from 'lodash';

const Pagination = props => {
    const { itemsCount, pageSize, onPageChange, currentPage } = props;
    const pageCount = Math.ceil(itemsCount / pageSize);
    if (pageCount === 1) return null;
    const currentRange = Math.ceil(currentPage / 5)
    const pages = _.range(currentRange * 5 - 4, currentRange * 5 + 1);

    const nextButton = () => {
        if (currentPage === pageCount) return null
        return <li
            className="pagination-item"
            onClick={() => onPageChange(currentPage + 1)}>
            >>
        </li>
    }

    return (
        < ul className="pagination justify-content-center" >
            {
                pages.map((page, index) =>
                    <li
                        key={index}
                        className={page === currentPage ? 'selected-link pagination-item' : 'pagination-item'}
                        onClick={() => onPageChange(page)}>
                        {page}
                    </li>)
            }
            < li className="pagination-item" >...</li >

            <li
                className="pagination-item"
                className={pageCount === currentPage ? 'selected-link pagination-item' : 'pagination-item'}
                onClick={() => onPageChange(pageCount)}>
                {pageCount}
            </li>
            {nextButton()}
        </ul >
    )
}

export default Pagination;