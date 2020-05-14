import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user = new User();

  constructor(
    // Need to inject all the services in the constructor
    private validateService: ValidateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(f: NgForm) {

    // Required fields
    if (!f.valid) {
      this.toastr.info('Please fill all the required fields');
      return;
    }

    // Validate email
    if (!this.validateService.validateEmail(this.user.email)) {
      this.toastr.info('Please use a valid email');
      return ;
    }

    // Register user
    // Use the service with the function and the user object as is an observable
    // we need to subscribe to it and inside we have the data back
    this.authService.registerUser(this.user).subscribe((data:any) => {
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
