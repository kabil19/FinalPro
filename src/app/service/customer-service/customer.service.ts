import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

     
   
    private baseUrl = 'http://localhost:8080/api/customer';
    
    token:string = "";
    header:any;

    //private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem("token")}`);
    constructor(private http:HttpClient, public audService :AudioService,) {
        this.token = localStorage.getItem("token")!;
        this.header = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
          });
   }
  
   getAll():Observable<any>{

    const url = `${this.baseUrl}/getAll`;
    return this.http.get<any[]>(url, {headers:this.header});
  }

  regiterReq(regReq: any):Observable<any>{
    // this.audService.playSoundInsert()
    const url = `${this.baseUrl}/register`;
    return this.http.post<any>(url,regReq,{responseType :'json'})
  }
 

  delete(custId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/delete/${custId}`;
       return this.http.delete<any>(url,{responseType :'text' as 'json'});
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
}
