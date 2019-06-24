import React from 'react';
import _ from 'lodash';

const Pagination = props => {
    const { itemsCount, pageSize, onPageChange, currentPage } = props;
    const pageCount = Math.ceil(itemsCount / pageSize); //8
    // if (pageCount === 1) return null;
    const currentRange = Math.ceil(currentPage / 5); //curr page = 7, current range = 
    const renderRange = parseInt(pageCount - currentPage) === 0 ? currentPage : currentRange * 5 + 1;
    const pages = _.range(currentRange * 5 - 4, (pageCount < renderRange ? pageCount : renderRange));

    const nextButton = () => {
        if (currentPage === pageCount || pageCount < 5) return null
        return <li
            className="pagination-item"
            onClick={() => onPageChange(currentPage + 1)}>
            <i className="fa fa-angle-double-right" />
        </li>
    }

    const backButton = () => {
        if (currentRange === 1) return null
        return <li
            className="pagination-item"
            onClick={() => onPageChange(currentPage - 1)}>
            <i className="fa fa-angle-double-left"></i>
        </li>
    }

    const elipses = () => {
        let lastIncrement = (Math.ceil(pageCount / 5) * 5) - 4
        if (currentPage >= lastIncrement) return null
        return <li
            className="pagination-item no-hover">
            ...
        </li>
    }

    const lastPage = () => {
        return <li
            className="pagination-item-elipses"
            className={pageCount === currentPage ? 'selected-link pagination-item' : 'pagination-item'}
            onClick={() => onPageChange(pageCount)}>
            {pageCount}
        </li>
    }

    return (
        < ul className="pagination justify-content-center" >
            {backButton()}
            {
                pages.map((page, index) =>
                    <li
                        key={index}
                        className={page === currentPage ? 'selected-link pagination-item' : 'pagination-item'}
                        onClick={() => onPageChange(page)}>
                        {page}
                    </li>)
            }
            {elipses()}
            {lastPage()}
            {nextButton()}
        </ul >
    )
}

export default Pagination;