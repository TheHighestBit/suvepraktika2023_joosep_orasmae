import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
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
  tableColumns = [ 'borrowedBook.title', 'borrowerLastName', 'dueDate', 'checkedOutDate', 'returnedDate']; //Columns for the checkout table
  currentDate = new Date().toISOString().slice(0, 10); //Needed to distinguish between overdue and not overdue checkouts
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
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
    //This fix adapted from https://stackoverflow.com/a/49057493
    this.checkoutsDataSource.sortingDataAccessor = (item: Checkout, property: string) => {
      switch(property) {
        case 'borrowedBook.title': return item.borrowedBook.title;
        default: return item[property as keyof Checkout] as string;
      }
    };
    
    //Must be set after the view has been created
    this.checkoutsDataSource.sort = this.sort;
    this.checkoutsDataSource.paginator = this.paginator;
  }
}