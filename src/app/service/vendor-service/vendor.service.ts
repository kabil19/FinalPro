import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  
   
    private baseUrl = 'http://localhost:8080/api/vendor';
    


  constructor(private http:HttpClient, public audService :AudioService,) { }
  
 

  regiterReq(regReq: any):Observable<any>{
    // this.audService.playSoundInsert()
    const url = `${this.baseUrl}/register`;
    return this.http.post<any>(url,regReq,{responseType :'text' as 'json'})
  }

  getAll():Observable<any>{
    const url = `${this.baseUrl}/getAll`;
    return this.http.get<any[]>(url);
  }

  delete(vendorId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/delete/${vendorId}`;
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
