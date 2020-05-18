// Injectable to protect the routerlinks that you should not pass if youre not logged in
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate() {
    const user = this.authService.getUser();
    if (user.type == 'a' || user.type == 'm') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
