import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    // Create the user person
    const user = {
      username: this.username,
      password: this.password
    }

    // Create the petition to authenticate the user and get all the data from the database
    this.authService.authenticateUser(user).subscribe((data:any) => {
      if (data.success) {
        // If the login is success we are going to store the data into the local storage
        this.authService.storeUserData(data.token, data.user)
        // Show message as logged in
        this.toastr.success("Wellcome " + data.user.name);
        this.router.navigate(['/profile']);
      } else {
        // Show message as cant log in
        this.toastr.error("There has been an error ");
        this.router.navigate(['/login']);
      }
    });
  }

}

