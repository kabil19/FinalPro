import { Component, OnInit } from '@angular/core';
import { CurrentLoggedInUserService } from 'src/app/service/current-logged-user-service/current-logged-in-user.service';

@Component({
  selector: 'app-user-deatils',
  templateUrl: './user-deatils.component.html',
  styleUrls: ['./user-deatils.component.css','../../../../assets/CSS/ComponentCommDesign.css']
})
export class UserDeatilsComponent implements OnInit {
userName:string = '' 
role :string =''
    constructor(private currentLoggedInUserService:CurrentLoggedInUserService){
       
    }

    ngOnInit(): void {
        const token = localStorage.getItem('token');
        this.currentLoggedInUserService.userNameSplit(token)
        this.userName = this.currentLoggedInUserService.getUsername()
        this.role = this.currentLoggedInUserService.getRole()
    }
   

//   imgUrl:string = 'https://variety.com/wp-content/uploads/2021/04/Avatar.jpg?w=800'
}
