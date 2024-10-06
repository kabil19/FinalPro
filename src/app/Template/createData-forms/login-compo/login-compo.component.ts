import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SalesInvocieChequeService } from 'src/app/service/salesInvoiceCheque-service/sales-invocie-cheque.service';
import { NotificationService } from 'src/app/service/notification-service/notification.service';



@Component({
  selector: 'app-login-compo',
  templateUrl: './login-compo.component.html',
  styleUrls: ['./login-compo.component.css']
})

export class LoginCompoComponent implements OnInit {
 hide:boolean=true;
logForm : FormGroup;




  ngOnInit(): void {
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService:NotificationService,
    private toastr:ToastrService
  ) { 

    this.logForm=new FormGroup({
        userName:new FormControl(null,Validators.required),
        password: new FormControl(null,Validators.required)
        })
  

  }

  message: any;


  loginUser(): void {
       this.authService.logInReq(this.logForm.value).subscribe((res) => {
         var result = JSON.parse(res)
         const token = result.token
         
        if (this.authService.isValidJWT(token)) {
            this.authService.login(result.token);
            this.toastr.clear();
            if(localStorage.getItem('token')){
                console.log("tokenFound")
                this.router.navigate(["/dash_board"]);
            }
        }
    },(err)=>{
        this.toastr.error("Login Failed, Check the credentials!")
    });
  }
}
