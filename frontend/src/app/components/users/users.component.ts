import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
declare var swal:any

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  user: User;
  users: User[] = []
  loading = true;
  constructor(
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authService.getUsers().subscribe((res:any)=> {
      if(res.success){
        this.users = res.data
      } else {
        this.toast.error('Database error');
      }
      this.loading = false;
    })
  }

  deleteUser(id: string){
    swal({
      title: 'Are you sure you want to delete?',
      text: "",
      type: '',
      showCancelButton: true,
      confirmButtonText: 'YES, DELETE!',
      cancelButtonText: 'CANCEL'
    }).then((result) => { 
      this.authService.deleteUser(id).subscribe((res:any) => {
        if(res.success){
          this.toast.success("Saving was deleted succesfully");
          this.authService.getUsers().subscribe((res:any)=> {
            if(res.success){
              this.users = res.data
            } else {
              this.toast.error('Database error')
            }
          })
        }
      });
    });
  }

}