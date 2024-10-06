import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegistrationForm } from 'src/app/Template/createData-forms/registration-form/userRegistration-form.component';
import { AudioService } from '../audio-service/audio-service.service';


@Injectable({
  providedIn: 'root'
})

export class UserService {
    
   
    private baseUrl = 'http://localhost:8080/api/user';
    


  constructor(private http:HttpClient) { }
  
 

  insertNewUser(regReq: any):Observable<any>{
    const url = `${this.baseUrl}/insertNewUser`;
    return this.http.post<any>(url,regReq,{responseType :'json' as 'json'})
  }

  getAllUser():Observable<any>{
    const url = `${this.baseUrl}/getAll`;
    return this.http.get<any[]>(url);
  }

  deleteUser(userId:any) {
    // this.audService.playSoundDelete()
       const url =`${this.baseUrl}/delete/${userId}`;
       return this.http.delete<any>(url,{responseType :'json' as 'json'});
  }

  updateUserDetails(updateRequestData: UserRegistrationForm):Observable<any>{
    // this.audService.playSoundUpdate()
    const url = `${this.baseUrl}/update`;
    return this.http.put<UserRegistrationForm>(url,updateRequestData,{responseType :'json' as 'json'})
  }

  findData(dataChar:any) {
    const url = `${this.baseUrl}/select/${dataChar}`;
    return this.http.get<any>(url)
  }
}

