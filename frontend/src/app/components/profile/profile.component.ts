import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { SavingService } from 'src/app/services/saving.service';
import { Saving } from 'src/app/models/saving';
import { ToastrService } from 'ngx-toastr';
declare var swal: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  savings: Saving[] = []
  loading = true;
  constructor(
    private authService: AuthService,
    private savingsService: SavingService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe((profile:any) => {
      this.user = profile.user;
      this.savingsService.getSavingsByUser(this.user._id).subscribe((res:any) => {
        console.log(res)
        if(res.success){
          this.savings = res.data
        }
        this.loading = false;
      })
    },
    err => {
      console.log(err);
      return false;
    });
  }

  deleteSaving(id: string){
    swal({
      title: 'Are you sure you want to delete?',
      text: "",
      type: '',
      showCancelButton: true,
      confirmButtonText: 'YES, DELETE!',
      cancelButtonText: 'CANCEL'
    }).then((result) => { 
      this.savingsService.deleteSaving(id).subscribe((res:any) => {
        if(res.success){
          this.toast.success("Saving was deleted succesfully");
          this.savingsService.getSavingsByUser(this.user._id).subscribe((res:any) => {
            if(res.success){
              this.savings = res.data
            }
            this.loading = false;
          })
        }
      });
    });
  }

}