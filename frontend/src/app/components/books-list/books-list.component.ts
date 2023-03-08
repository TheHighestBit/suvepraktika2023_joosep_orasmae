import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({});

    this.books$.subscribe((page: Page<Book>) => { //The table doesn't accept observables as data sources
      this.booksDataSource.data = page.content;
    });
  }

  ngAfterViewInit(): void {
    //Must be set after the view has been created
    this.booksDataSource.sort = this.sort;
    this.booksDataSource.paginator = this.paginator;
  }

}