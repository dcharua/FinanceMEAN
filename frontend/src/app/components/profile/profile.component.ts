import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe((profile:any) => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });
  }

}