import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user = new User();
  edit = false;

  constructor(
    // Need to inject all the services in the constructor
    private validateService: ValidateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      // if route has a param than is manager editing a user
			if (paramMap.has('id')) {
        this.authService.getUserbyId(paramMap.get('id')).subscribe((res:any) => {
          if(res.success){
            this.user = res.data
          }
        })
        this.edit = true
      }
    });

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
    if(this.edit){

      this.authService.updateUser(this.user).subscribe((res:any) => {
        // Lets validate the response and show the user the response with an alert
        if (res.success) {
          this.toastr.success('User updated succesfull');
          // If the registration is success move to the login component
          this.router.navigate(['/users']);
        } else {
          this.toastr.error('Something went wrong please try again');
          // If the registration is success move to the login component
          this.router.navigate(['/register']);
        }
      });
    } else {      
      this.authService.registerUser(this.user).subscribe((res:any) => {
        // Lets validate the response and show the user the response with an alert
        if (res.success) {
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
}
