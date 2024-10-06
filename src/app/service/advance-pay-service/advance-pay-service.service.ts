import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvancePayServiceService {

  private baseUrl = 'http://localhost:8080/api/payments'
  constructor(private http: HttpClient) {

  }

  getAllPayments(invoiceId: any,): Observable<any> {

    // getAllPayments(invoiceId: any): Observable<any> {
    const url = `${this.baseUrl}/getAllPayments/${invoiceId}`;
    return this.http.get<any[]>(url, { responseType: 'json' as 'json' });
  }

}
