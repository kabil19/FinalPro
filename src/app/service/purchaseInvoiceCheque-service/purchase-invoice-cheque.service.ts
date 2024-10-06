import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceChequeService {

    private baseUrl = 'http://localhost:8080/api/purchaseInvoiceChequePayments'
    constructor(private http:HttpClient) { }

    getAllConfirmedPurchaseInvoiceDueCheques(headers: HttpHeaders): Observable<any> {
        const url = `${this.baseUrl}/getAllConfirmedPurchaseInvoiceDueCheques`;
        return this.http.get<any[]>(url, { headers, responseType: 'json' as 'json' });
    }
}
