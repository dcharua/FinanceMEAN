import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AddSavingComponent } from './components/saving/saving.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // Protect the following routes if youre logged in 
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'add-saving', component: AddSavingComponent, canActivate: [AuthGuard] },
  { path: 'edit-saving/:id', component: AddSavingComponent, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
