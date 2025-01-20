import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  imports: [
    NgIf,
    NgForOf,
    MatIcon,
    NgClass
  ],
  standalone: true
})
export class PaginationComponent implements OnInit {
  /** The total number of records */
  @Input()
  collectionSize = 0;

  @Output('onPageChange') pageChange = new EventEmitter<number>();

  /** The number of records to display */
  @Input()
  pageSize = 20;

  /** Current page */
  @Input()
  currentPage = 1;

  /** The number of buttons to show either side of the current page */
  @Input()
  maxSize = 2;

  totalPages: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
  }

  /** Set page number */
  selectPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageChange.emit(pageNumber);
  }

  /** Set next page number */
  next() {
    const nextPage = this.currentPage + 1;
    nextPage <= this.totalPages.length && this.selectPageNumber(nextPage);
  }

  /** Set previous page number */
  previous() {
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }
}
