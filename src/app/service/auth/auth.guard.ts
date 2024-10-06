import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    if (this.authService.isLoggedIn()) {
      if (url === '/login') {
        this.router.navigate(['/dash_board']);
        return false;
      }
      return true;
    } else {
      if (url !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}