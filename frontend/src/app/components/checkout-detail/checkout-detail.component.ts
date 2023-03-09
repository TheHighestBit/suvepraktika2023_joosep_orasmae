import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Checkout } from 'src/app/models/checkout';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.scss']
})
export class CheckoutDetailComponent implements OnInit {
  checkout$!: Observable<Checkout>;
  checkoutForm!: FormGroup;
  book!: Book;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private bookService: BookService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      borrowerFirstName: new FormControl('', Validators.required),
      borrowerLastName: new FormControl('', Validators.required),
      dueDate: new FormControl('', this.dateFormatValidator()),
      returnedDate: new FormControl(''),
      id: new FormControl(''),
      checkedOutDate: new FormControl('', this.dateFormatValidator())
    });

    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)));

    this.checkout$.subscribe(checkout => {
      this.checkoutForm.patchValue(checkout);
      this.book = checkout.borrowedBook;
    });
  }

  checkoutClick(): void {
    if (this.checkoutForm.valid) {
      const updatedCheckout = this.checkoutForm.value as Checkout;

      this.book.status = 'AVAILABLE'; //Update the status of the book
      this.bookService.saveBook(this.book)
      .subscribe(book => {
        console.log('Book set as available:', book);
    });

    updatedCheckout.borrowedBook = this.book;

    updatedCheckout.returnedDate = new Date().toISOString().slice(0, 10); //Set the returned date to today

    this.checkoutService.checkout(updatedCheckout)
      .subscribe(checkout => {
        console.log('Book returned:', checkout);
        this.location.back();
      });
    }
  }

  deleteCheckoutClick(): void {
    const checkoutId = this.checkoutForm.get('id')?.value;

    this.checkoutService.deleteCheckout(checkoutId)
      .subscribe(checkout => {
        console.log('Checkout deleted:', checkout);
        this.location.back();
      });
  }

  dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
  
      const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/; //This omits range validation
      const isValid = dateRegex.test(value);
      return isValid ? null : { 'dateFormat': { value: control.value } };
    };
  }
  
}