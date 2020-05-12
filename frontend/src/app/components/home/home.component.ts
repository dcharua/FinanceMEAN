import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn = false;
  ref: any;
  constructor(private authService: AuthService) {

   }

  ngOnInit(): void {
    this.ref = this.authService.isLogged().subscribe(res => {
      this.loggedIn = res;
    });
  }

  ngOnDestroy(): void {
    if(this.ref) this.ref.unsubscribe();
  }

}
