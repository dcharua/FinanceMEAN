import { Injectable } from '@angular/core';
// Bring http module and headers package
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import the JWT service from @auth0/angular-jwt *Angular v6+ and RxJS v6+*
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Saving } from '../models/saving';

@Injectable({
  providedIn: 'root'
})

export class SavingService {
  // Propeties
  authToken: any;

  constructor(
    // Inject the http module in the constructor
    private http: HttpClient,
    // Import the JWT service
    public jwtHelper: JwtHelperService
  ) {
    this.loadToken();
   }

  // Function to get the token stored in the local storage
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  addSaving(saving: Saving){
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.post(environment.apiUrl + 'savings/add', saving, { headers});
  }

  getSaving(_id:string){
    const headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.get(environment.apiUrl + 'savings/get/' + _id , { headers});
  }

  editSaving(saving:Saving){
    const headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.put(environment.apiUrl + 'savings/update/' + saving._id ,saving, {headers} );
  }

  deleteSaving(_id: string){
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.delete(environment.apiUrl + 'savings/delete/' + _id, {headers});
  }


  getSavingsByUser(userId: string){
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.get(environment.apiUrl + 'savings/getSavingsByUser/' + userId, {headers});
  }

  getFilterSavingsByUser(userId: string, filters){
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.post(environment.apiUrl + 'savings/getFilterSavingsByUser/' + userId, filters, {headers});
  }

  getAllSavings(){
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Return an observable with the response to our server  
    return this.http.get(environment.apiUrl + 'savings/getAll', {headers});
  }

}
