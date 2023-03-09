import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  bookForm!: FormGroup;
  statuses = ['AVAILABLE', 'BORROWED', 'RETURNED', 'DAMAGED', 'PROCESSING'];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
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

    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)));

    this.book$.subscribe(book => {
      this.bookForm.patchValue(book);
    });
  }

  saveBook(): void {
    if (this.bookForm.valid) { //Dont know if this is necessary but better safe than sorry
      const updatedBook = this.bookForm.value as Book;

    this.bookService.saveBook(updatedBook)
      .subscribe(book => {
        console.log('Book updated:', book);
      });
    }
  }

  deleteBook(): void {
    const bookId = this.bookForm.get('id')?.value;

    this.bookService.deleteBook(bookId)
      .subscribe(() => {
        console.log('Book deleted');
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
  
}
