import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

    private baseUrl = 'http://localhost:8080/api/tempInvoice';
    
  constructor(private http:HttpClient, public audService :AudioService,) { }
  
 

  createTempSalesInvoice(regReq: any):Observable<any>{
    // this.audService.playSoundInsert()
    const url = `${this.baseUrl}/createTempSalesInvoice`;
    return this.http.post<any>(url,regReq,{responseType :'json' as 'json'})
  }

  getAll():Observable<any>{
    const url = `${this.baseUrl}/getAll`;
    return this.http.get<any[]>(url);
  }

  deleteTempSalesInvoice(invoiceId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/deleteTempSalesInvoice/${invoiceId}`;
       return this.http.delete<any>(url,{responseType :'json' as 'json'});
  }

  update(updateRequestData: any):Observable<any>{
    // this.audService.playSoundUpdate()
    const url = `${this.baseUrl}/update`;
    return this.http.put<any>(url,updateRequestData,{responseType :'text' as 'json'})
  }

  findData(dataChar:any) {
    const url = `${this.baseUrl}/select/${dataChar}`;
    return this.http.get<any>(url)
  }

  getTempInvocieById(tempInvoiceId:number):Observable<any>{
    const url = `${this.baseUrl}/getTempInvoiceById/${tempInvoiceId}`;
    return this.http.get<any[]>(url);
  }

}
