import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { SavingService } from 'src/app/services/saving.service';
import { Saving } from 'src/app/models/saving';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
declare var swal: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  filters = {
    bank: '', 
    balance_lower: '',
    balance_higher: '',
    start: ''
  }
  banks: string [] = []
  user: User = new User();
  savings: Saving[] = []
  loading = true;
  total_balance = 0;
  taxes_paid = 0;
  interests_balance = 0;
  total_initial = 0;
  projection:any;

  constructor(
    private authService: AuthService,
    private savingsService: SavingService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      // if route has a param than is and admin getting a user profile
			if (paramMap.has('id')) {
        this.savingsService.getSavingsByUser(paramMap.get('id')).subscribe((res:any) => {
          if(res.success){
            this.resetBalance();
            this.savings = res.data
            this.savings.map(saving => this.calTotalBalance(saving))
            this.loading = false;
          }
          this.loading = false;
        })

      // else if a user is gettig his profile
      } else {
        this.authService.getProfile().subscribe((profile:any) => {
          this.user = profile.user;
          this.savingsService.getSavingsByUser(this.user._id).subscribe((res:any) => {
            if(res.success){
              this.resetBalance();
              this.savings = res.data
              this.savings.map(saving => this.calTotalBalance(saving))
            }
            this.loading = false;
          })
        },
        err => {
          console.log(err);
          return false;
        });
      }
    });
  }

  // get total numbers from savings
  calTotalBalance(saving: Saving): Saving{
    saving.total_balance = saving.balance + saving.interest_balance -  saving.taxes_paid;
    this.total_initial+= saving.balance;
    this.total_balance+= saving.total_balance;
    this.interests_balance += saving.interest_balance;
    this.taxes_paid += saving.taxes_paid;
    // if bank name not in filter sarray end it
    if(this.banks.indexOf(saving.bank) === -1){
      this.banks.push(saving.bank)
    }
    return saving
  }

  // function to reset balance when new savings are filter or projected
  resetBalance():void{
    this.total_balance = 0;
    this.taxes_paid = 0;
    this.interests_balance = 0;
    this.total_initial = 0;
  }

  // filter savings by fileds given
  filterSavings(){
    this.loading = true;
    this.savingsService.getFilterSavingsByUser(this.user._id, this.filters).subscribe((res:any) => {
      if(res.success){
        this.resetBalance();
        this.savings = res.data
        this.savings.map(saving => this.calTotalBalance(saving))
      }
      this.loading = false;
    });
  }

  // project interests and taxes to a date
  getProjections(){
    if(!this.projection){
      this.toast.error('Please select a date and try again!');
      return;
    }
    this.loading = true;
    this.savingsService.getProjectionsByUser(this.user._id, this.projection).subscribe((res:any) => {
      if(res.success){
        this.resetBalance();
        this.savings = res.data
        this.savings.map(saving => this.calTotalBalance(saving))
      }
      this.loading = false;
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
            this.resetBalance();
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