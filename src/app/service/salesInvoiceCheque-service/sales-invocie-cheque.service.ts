import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesInvocieChequeService {

    private baseUrl = 'http://localhost:8080/api/salesInvoiceChequePayments'
    constructor(private http:HttpClient) { }

    getAllConfirmedSalesInvoiceCheques(headers: HttpHeaders): Observable<any> {
        const url = `${this.baseUrl}/getAllConfirmedSalesInvoiceDueCheques`;
        return this.http.get<any[]>(url, { headers, responseType: 'json' as 'json' });
    }
   /*  getAllTempSalesInvoiceCheques(): Observable<any> {
        const url = `${this.baseUrl}/getAllTempSalesInvoiceDueCheques`;
        return this.http.get<any[]>(url, { responseType: "json" });
    } */
}
