import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Checkout } from 'src/app/models/checkout';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.scss']
})
export class CheckoutDetailComponent implements OnInit {
  checkout$!: Observable<Checkout>;
  checkoutForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService
  ) {
  }

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      borrowerFirstName: new FormControl('', Validators.required),
      borrowerLastName: new FormControl('', Validators.required),
      dueDate: new FormControl('', this.dateFormatValidator()),
    });

    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)));

    this.checkout$.subscribe(checkout => {
      this.checkoutForm.patchValue(checkout);
    });
  }

  checkoutClick(): void {
    if (this.checkoutForm.valid) { //Dont know if this is necessary but better safe than sorry
      const updatedCheckout = this.checkoutForm.value as Checkout;

    this.checkoutService.checkout(updatedCheckout)
      .subscribe(checkout => {
        console.log('Book updated:', checkout);
      });
    }
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
