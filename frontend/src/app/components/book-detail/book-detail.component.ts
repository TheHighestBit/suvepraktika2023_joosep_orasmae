import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { BookStatus } from '../../models/book-status';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
    private bookService: BookService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [''],
      year: [''],
      added: [''],
      checkOutCount: [''],
      status: [''],
      dueDate: [''],
      comment: ['']
    });

    
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)));

    this.book$.subscribe(book => {
      this.bookForm.patchValue(book);
    });
  }

  saveBook(): void {
    const updatedBook = this.bookForm.value as Book;

    // Update the book using the BookService
    this.bookService.saveBook(updatedBook)
      .subscribe(book => {
        console.log('Book updated:', book);
      });
  }

  deleteBook(): void {
    const bookId = this.bookForm.get('id')?.value;

    // Delete the book using the BookService
    this.bookService.deleteBook(bookId)
      .subscribe(() => {
        console.log('Book deleted');
      });
  }
}
