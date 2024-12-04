import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnCartService {

    private baseUrl = 'http://localhost:8080/api/returnInvoiceProduct';
    
    constructor(private http:HttpClient) { }
    
   
  
    addToReturnCart(regReq: any):Observable<any>{
      // this.audService.playSoundInsert()
      const url = `${this.baseUrl}/addToReturnCart`;
      return this.http.post<any>(url,regReq,{responseType :'json' as 'json'})
    }
    retrieveRemainingCartItems(id: number):Observable<any>{
      // this.audService.playSoundInsert()
      const url = `${this.baseUrl}/retrieveRemainingCartItems/${id}`;
      return this.http.get<any>(url,{responseType :'json' as 'json'})
    }
  
}
