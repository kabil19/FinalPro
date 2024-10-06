import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }



  addPayment(regReq: any): Observable<any> {
    // this.audService.playSoundInsert()
    const url = `${this.baseUrl}/addPayment`;
    return this.http.post<any>(url, regReq, { responseType: 'json' })

  }

  getAllPayments(invoiceId: any): Observable<any> {
    const url = `${this.baseUrl}/getAllPayments/${invoiceId}`;
    return this.http.get<any[]>(url, { responseType: 'json' });
  }

  // loadAll():Observable<any>{
  //   const url = `${this.baseUrl}/loadAll`;
  //   return this.http.get<any[]>(url,{responseType:'json'});
  // }

  deletePayment(payemntId: any) {
    const url = `${this.baseUrl}/deletePayment/${payemntId}`;
    return this.http.delete<any>(url, { responseType: 'json' });
  }

  updatePayment(updateRequestData: any): Observable<any> {
    // this.audService.playSoundUpdate()
    const url = `${this.baseUrl}/updatePayment`;
    return this.http.put<any>(url, updateRequestData, { responseType: 'json' })
  }

  findData(tempInvoiceId: number, dataChar: any) {
    const url = `${this.baseUrl}/select/${tempInvoiceId}/${dataChar}`;
    return this.http.get<any>(url, { responseType: 'json' })
  }
}
