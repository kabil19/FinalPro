import { Injectable } from '@angular/core';
import { AudioService } from '../audio-service/audio-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryFormComponent } from 'src/app/Template/createData-forms/category-form/category-form.component';

@Injectable({
  providedIn: 'root'
})
export class CetegoryService {

 
  
    private baseUrl = 'http://localhost:8080/api/category';
    


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

  delete(catId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/delete/${catId}`;
       return this.http.delete<any>(url,{responseType :'text' as 'json'});
  }

  update(updateRequestData: CategoryFormComponent):Observable<any>{
    // this.audService.playSoundUpdate()
    const url = `${this.baseUrl}/update`;
    return this.http.put<CategoryFormComponent>(url,updateRequestData,{responseType :'text' as 'json'})
  }

  findData(dataChar:any) {
    const url = `${this.baseUrl}/select/${dataChar}`;
    return this.http.get<any>(url)
  }
}

