import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { Observable } from 'rxjs';
import { StockFormComponent } from 'src/app/Template/createData-forms/stock-form/stock-form.component';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  
    private baseUrl = 'http://localhost:8080/api/stock';
    


  constructor(private http:HttpClient, public audService :AudioService,) { }
  
 

  regiterReq(regReq: any):Observable<any>{
    // this.audService.playSoundInsert()
    const url = `${this.baseUrl}/register`;
    return this.http.post<any>(url,regReq,{responseType :'text' as 'json'})
  }

  getAllStock():Observable<any>{
    const url = `${this.baseUrl}/getAllStock`;
    return this.http.get<any[]>(url);
  }

  delete(stockId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/delete/${stockId}`;
       return this.http.delete<any>(url,{responseType :'text' as 'json'});
  }

  update(updateRequestData: StockFormComponent):Observable<any>{
    // this.audService.playSoundUpdate()
    
    const url = `${this.baseUrl}/update`;
    return this.http.put<StockFormComponent>(url,updateRequestData,{responseType :'text' as 'json'})
  }

  findData(dataChar:any) {
    const url = `${this.baseUrl}/select/${dataChar}`;
    return this.http.get<any>(url)
  }
}
