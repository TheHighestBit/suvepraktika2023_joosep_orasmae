import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$!: Observable<Page<Book>>;
  booksDataSource = new MatTableDataSource<Book>();
  tableColumns = ['title', 'author', 'genre', 'status']; //The columns we want our book-list table to display
  searchValue = ''; //Bound to the string in the search bar
  selectedStatus = ''; //Bound to the status dropdown
  bookStatuses = ['AVAILABLE', 'BORROWED', 'RETURNED', 'DAMAGED', 'PROCESSING'];
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    // I spent a good hour trying to get server side pagination to work but to no avail. So I'm just fetching all of the books at once :/
    this.books$ = this.bookService.getBooks({pageIndex: 0, pageSize: 1500});

    this.books$.subscribe((page: Page<Book>) => { //The table doesn't accept observables as data sources
      this.booksDataSource.data = page.content;
      this.booksDataSource.paginator = this.paginator;
      this.booksDataSource.sort = this.sort;

      this.booksDataSource.filterPredicate = (data: Book, filter: string) => {
        //This is a workaround for the fact that the filter only updates when the string is changed
        //so we need to pass the status in the filter string as well
        const status = filter.split('|')[1];
        const filterString = filter.split('|')[0];

        return (data.title.toLowerCase().includes(filterString) || data.author.toLowerCase().includes(filterString) ||
          data.genre.toLowerCase().includes(filterString)) && (data.status === status || status === '');
      }
    });
  }

  applyFilter() {
    this.booksDataSource.filter = this.searchValue.trim().toLowerCase() + "|" + this.selectedStatus;
    
    if (this.booksDataSource.paginator) {
      this.booksDataSource.paginator.firstPage(); // go back to the first page if we're using pagination
    }
  }
  
}