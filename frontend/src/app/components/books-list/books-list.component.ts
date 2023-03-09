import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PageRequest } from '../../models/page';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$!: Observable<Page<Book>>;
  booksDataSource = new MatTableDataSource<Book>();
  tableColumns = ['title', 'author', 'genre', 'status']; //The columns we want our book-list table to display
  
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
    });
  }
}