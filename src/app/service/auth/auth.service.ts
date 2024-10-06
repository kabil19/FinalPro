import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginRequest } from 'src/app/Template/createData-forms/login-compo/LoginRequest';
import { NotificationService } from '../notification-service/notification.service';
import { SalesInvocieChequeService } from '../salesInvoiceCheque-service/sales-invocie-cheque.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private router:Router,private toastr:ToastrService,private notificationService:NotificationService) {}

  private baseUrl = 'http://localhost:8080/api/authentication/login';


  logInReq(data:LoginRequest):Observable<any>{
    const url = `${this.baseUrl}`;
    return this.http.post<LoginRequest>(url, data,{responseType:'text' as 'json'});
  }

 

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if(token){
      if(this.isValidJWT(token)){
        return !!localStorage.getItem('token');
      }
    }
    return false
  }

  login(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.router.navigate(['/login']);
    // this.notificationService.clearData()
  }

  isValidJWT(token: string): boolean {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if(payload.exp && payload.exp > currentTime){
        return true;
      }else{
        this.toastr.clear()
        this.toastr.warning("Token Expired","Logged out")
        this.logout();
        return false;
      }
    } catch (e) {
      return false;
    }
  }


}
