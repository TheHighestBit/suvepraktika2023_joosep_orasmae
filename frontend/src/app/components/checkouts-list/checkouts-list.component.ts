import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CheckoutService } from '../../services/checkout.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { Checkout } from '../../models/checkout';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.scss']
})
export class CheckoutsListComponent implements OnInit {

  checkouts$!: Observable<Page<Checkout>>;
  checkoutsDataSource = new MatTableDataSource<Checkout>();
  tableColumns = ['dueDate', 'checkedOutDate', 'returnedDate']; //Columns for the checkout table
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private bookService: BookService,
    private checkoutService: CheckoutService,
  ) {
  }

  ngOnInit(): void {
    this.checkouts$ = this.checkoutService.getCheckouts();

    this.checkouts$.subscribe((page: Page<Checkout>) => {
      this.checkoutsDataSource.data = page.content;
    });
  }

  ngAfterViewInit(): void {
    //Must be set after the view has been created
    this.checkoutsDataSource.sort = this.sort;
    this.checkoutsDataSource.paginator = this.paginator;
  }
}