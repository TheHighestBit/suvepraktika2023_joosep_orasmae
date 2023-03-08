import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../models/page';
import { Checkout } from '../models/checkout';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly baseUrl = environment.backendUrl + '/api/checkout';

  constructor(
    private http: HttpClient,
  ) {
  }

  getCheckouts(): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/getCheckouts';
    return this.http.get<Page<Checkout>>(url);
  }

  getCheckout(checkoutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.get<Checkout>(url, {params});
  }

  checkout(checkout: Checkout): Observable<void> {
    const url = this.baseUrl + '/checkout';
    return this.http.post<void>(url, checkout);
  }

  deleteCheckout(checkoutId: string): Observable<void> {
    const url = this.baseUrl + '/checkout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.delete<void>(url, {params});
  }
}
