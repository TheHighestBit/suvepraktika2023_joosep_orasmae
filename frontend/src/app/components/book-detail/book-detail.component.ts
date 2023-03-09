import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Checkout } from 'src/app/models/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  bookForm!: FormGroup;
  checkoutForm!: FormGroup;
  statuses = ['AVAILABLE', 'BORROWED', 'RETURNED', 'DAMAGED', 'PROCESSING'];
  showCheckout = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private checkoutService: CheckoutService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.bookForm = new FormGroup({
      title: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      genre: new FormControl('', Validators.required),
      year: new FormControl('', [Validators.required, Validators.min(0)]),
      added: new FormControl('', [Validators.required, this.dateFormatValidator()]), //The () after the validator is important
      checkOutCount: new FormControl('', [Validators.required, Validators.min(0)]),
      status: new FormControl('', Validators.required),
      dueDate: new FormControl('', this.dateFormatValidator()),
      comment: new FormControl(''),
      id: new FormControl(''), 
    });

    this.checkoutForm = new FormGroup({
      borrowerFirstName: new FormControl('', Validators.required),
      borrowerLastName: new FormControl('', Validators.required),
      dueDate: new FormControl('', this.dateFormatValidator())
    });

    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)));

    this.book$.subscribe(book => {
      this.bookForm.patchValue(book);
      this.showCheckout = book.status === 'AVAILABLE';
    });
  }

  saveBook(): void {
    if (this.bookForm.valid) { //Dont know if this is necessary but better safe than sorry
      const updatedBook = this.bookForm.value as Book;

      this.bookService.saveBook(updatedBook)
        .subscribe(book => {
          console.log('Book updated:', book);
          this.location.back();
        });
    }
  }

  deleteBook(): void {
    const bookId = this.bookForm.get('id')?.value;

    this.bookService.deleteBook(bookId)
      .subscribe(() => {
        console.log('Book deleted');
        this.location.back();
      });
  }

  dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) { //A book doesnt have to have a due date, if it isnt borrowed
        return null;
      }
  
      const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/; //This omits range validation
      const isValid = dateRegex.test(value);
      return isValid ? null : { 'dateFormat': { value: control.value } };
    };
  }

  checkoutClick(): void{
    if (this.checkoutForm.valid && this.bookForm.valid) {
      const checkout = this.checkoutForm.value as Checkout;
      const book = this.bookForm.value as Book;

      book.status = 'BORROWED';
      book.dueDate = checkout.dueDate;
      book.checkOutCount++;
      checkout.borrowedBook = book;

      this.bookService.saveBook(book).subscribe((book) => { //Update the book on the server side
        console.log('Book updated:', book);
    });

      checkout.checkedOutDate = new Date().toISOString().slice(0, 10);

      this.checkoutService.checkout(checkout).subscribe((checkout) => {
        console.log('Checkout created:', checkout);
        this.location.back();
      });
  }
  }

  onStatusChange() {
    if (this.bookForm.get('status')?.value === 'AVAILABLE') {
      this.showCheckout = true;
    } else {
      this.showCheckout = false;
    }
  }

  favoriteBook(): void {
    const updatedBook = this.bookForm.value as Book;
    if (localStorage.getItem(updatedBook.title) === null) {
      this.localStorageService.saveData(updatedBook.title, JSON.stringify(updatedBook));
      console.log(updatedBook);
    } else {
      this.localStorageService.removeData(updatedBook.title);
    }
  }
}
