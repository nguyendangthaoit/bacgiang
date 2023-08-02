import React, { useState, useEffect } from 'react';
import {
  Row,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import { PAGE_NUM_DEFAULT, PAGE_SIZE_DEFAULT } from '../../constants/common';

const PaginationPage = (props) => {

  const [paginationPage, setPaginationPage] = useState(null);

  useEffect(() => { setPage(1) }, [props.totalElement])


  const setPage = (page) => {

    const pagers = getPage(props.totalElement, page, props.page_size);
    setPaginationPage(pagers);
    props.changePage(page)
  }
  return (
    <Row className="px-3 py-1 pull-right">
      {
        paginationPage && paginationPage.pages[0] &&
        <Pagination aria-label="Page navigation example">
          <PaginationItem onClick={() => paginationPage.currentPage !== 1 && setPage(paginationPage.currentPage - 1)}
            disabled={paginationPage.currentPage === 1}>
            <PaginationLink previous />
          </PaginationItem>
          {
            paginationPage.pages.map(page =>
              <PaginationItem active={paginationPage.currentPage === page} key={page} onClick={() => setPage(page)}>
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
            )
          }
          <PaginationItem onClick={() => paginationPage.currentPage !== paginationPage.totalPages && setPage(paginationPage.currentPage + 1)}
            disabled={paginationPage.currentPage === paginationPage.totalPages}>
            <PaginationLink next />
          </PaginationItem>
        </Pagination>

      }
    </Row>
  );
}
export default PaginationPage

const getPage = (totalElement, currentPage = PAGE_NUM_DEFAULT, page_size = PAGE_SIZE_DEFAULT) => {
  // calculate total pages
  const totalPages = Math.ceil(totalElement / page_size);

  let startPage = 0;
  let endPage = 0;
  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 1 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }
  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * page_size;
  const endIndex = Math.min(startIndex + page_size - 1, totalElement - 1);
  // create an array of pages to ng-repeat in the pager control
  let pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  // return object with all pager properties required by the view
  return {
    totalElement,
    currentPage,
    page_size,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages
  };
}
