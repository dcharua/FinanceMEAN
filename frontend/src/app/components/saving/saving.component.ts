import { Component, OnInit } from '@angular/core';
import { Saving } from 'src/app/models/saving';
import { NgForm } from '@angular/forms';
import { SavingService } from 'src/app/services/saving.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
declare var $:any;
@Component({
  selector: 'app-saving',
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.scss']
})
export class AddSavingComponent implements OnInit {
  user = new User();
  saving = new Saving();
  edit = false;
  loading = true;
  
  constructor(
    private savingService: SavingService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.route.paramMap.subscribe(paramMap => {
      // if route has a param than we want to edit
			if (paramMap.has('id')) {
        // use that id to get the saving for editing, set edit flag to true
        this.savingService.getSaving(paramMap.get('id')).subscribe((res:any) =>{
          if(res.success){
            this.saving = res.data
            this.edit = true;
            this.loading = false;
          }else {
            this.toastr.error("There was an error loading this savings");
          }
        });
      } else {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    $('.datepicker').datepicker();
    this.authService.getProfile().subscribe((profile:any) => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  onSubmit(f: NgForm) {
    // if form is not valid return and show message
    if (!f.valid){
      this.toastr.error('Please fill all the required fields');
      return
    }
    // if edit go to edit endpoint otherwise go to new
    if (this.edit){
      this.savingService.editSaving(this.saving).subscribe((data:any) => {
        if (data.success) {
          this.toastr.success('The saving has been edited');
          this.router.navigate(['/profile']);
        } else {
          this.toastr.error('Something went wrong please try again');
          console.log(data)
        }
      });
    } else {
      this.saving.userId = this.user._id;
      this.savingService.addSaving(this.saving).subscribe((data:any) => {
        // Lets validate the response and show the user the response with an alert
        if (data.success) {
          this.toastr.success('The new saving has been saved');
          this.router.navigate(['/profile']);
        } else {
          this.toastr.error('Something went wrong please try again');
          console.log(data)
        }
      });
    }

  }
}
