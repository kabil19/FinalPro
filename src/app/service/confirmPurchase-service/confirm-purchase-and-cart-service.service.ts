import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmPurchaseAndCartServiceService {
    private baseUrl = "http://localhost:8080/api/confirmPurchase";

    constructor(private http: HttpClient) {}

    addToConfirmPurchase(purchaseId: number): Observable<any> {
        // this.audService.playSoundInsert()
        const url = `${this.baseUrl}/addToConfirmPurchase`;
        return this.http.post<any>(url, purchaseId, { responseType: "json" });
    }

    getAllConfirmPurchaseInvoices():Observable<any>{
        const url = `${this.baseUrl}/getAllConfirmPurchaseInvoices`;
        return this.http.get<any[]>(url,{responseType:'json'});
      }
      cancelPurchase(purchaseId: number):Observable<any>{
        const url = `${this.baseUrl}/cancelPurchase/${purchaseId}`;
        return this.http.delete<any[]>(url,{responseType:'json'});
      }
      searchConfirmInvoice(characters:any):Observable<any>{
        const url = `${this.baseUrl}/searchConfirmInvoice/${characters}`;
        return this.http.get<any[]>(url,{responseType:'json'});
      }
}
