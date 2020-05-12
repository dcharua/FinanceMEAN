import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

// Variables to use
name: String;
username: String;
email: String;
password: String;

constructor(
  // Need to inject all the services in the constructor
  private validateService: ValidateService,
  private toastr: ToastrService,
  private authService: AuthService,
  private router: Router
) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    // Create the user object
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    // Required fields
    if (!this.validateService.validateRegister(user)) {
      this.toastr.info('Please fill all the required fields');
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.toastr.info('Please use a valid email');
      return false;
    }

    // Register user
    // Use the service with the function and the user object as is an observable
    // we need to subscribe to it and inside we have the data back
    this.authService.registerUser(user).subscribe((data:any) => {
      // Lets validate the response and show the user the response with an alert
      if (data.success) {
        this.toastr.success('Registration succesfull, please log in');
        // If the registration is success move to the login component
        this.router.navigate(['/login']);
      } else {
        this.toastr.error('Something went wrong please try again');
        // If the registration is success move to the login component
        this.router.navigate(['/register']);
      }
    });

  }
}
