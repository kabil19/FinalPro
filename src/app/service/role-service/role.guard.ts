import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CurrentLoggedInUserService } from '../current-logged-user-service/current-logged-in-user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private currentLoggedInUserService: CurrentLoggedInUserService,
        private toastr: ToastrService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if(localStorage.getItem('token')){
            console.log("tokenFound")
            const role = this.currentLoggedInUserService.getRole();
            const allowedRoles = next.data['roles'] as Array<string>;
            if (allowedRoles.includes(role)) {
                console.log('AuthGuard#canActivate called');
                return true;
            } else {
                console.log('Access is denied!');
                this.toastr.error("Access is denied!")
                this.router.navigate(["/dash_board"]);
                return false;
            }
        }else{
            this.router.navigate(["/login"]);
            console.log("Not Found")
            return false
        }
        
    }
}
