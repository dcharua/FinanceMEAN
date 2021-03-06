import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { logging } from 'protractor';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn = false;
  ref: any;
  user: User = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.authService.loggedIn();
    // subscription to check if user logged in
    this.ref = this.authService.isLogged().subscribe(res => {
      this.loggedIn = res;
      if (this.loggedIn){
        this.user = this.authService.getUser();
      }
    });
    
  }
  onLogoutClick() {
    // Send the instruction to clear the local storage and the memory of the user logged in
    this.authService.logout()
    this.toastr.info("Succesfully logged out")
    this.router.navigate(['/login']);
    return false;
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref.unsubscribe();
  }
}
