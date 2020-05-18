import { Injectable } from '@angular/core';
// Bring http module and headers package
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import the JWT service from @auth0/angular-jwt *Angular v6+ and RxJS v6+*
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Propeties
  authToken: any;
  user: any;
  private logged = new Subject<any>();

  constructor(
    // Inject the http module in the constructor
    private http: HttpClient,
    // Import the JWT service
    public jwtHelper: JwtHelperService
  ) { 
    this.loadToken();
    this.loadUser();
    this.loggedIn();
  }

  // Function to register the user
  registerUser(user) {
    // Set a header value
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    // Return an observable with the response to our server  
    return this.http.post(environment.apiUrl + 'users/register', user, { headers});
    // Map the response to json
  }

  // Function to authenticate an user
  authenticateUser(user) {
    // Set a header value
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    // Return an observable with the response to our server
    return this.http.post(environment.apiUrl + 'users/authenticate', user, { headers});
  }

  getProfile() {
    // Set a header value
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Add the content type: json | Add the value to a header
    headers.append('Content-Type', 'application/json');
    // Return an observable with the response to our server
    return this.http.get(environment.apiUrl + 'users/profile', { headers });
  }

  /// MANAGER ROUTES
  getUsers(){
    // Set a header value
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Add the content type: json | Add the value to a header
    headers.append('Content-Type', 'application/json');
    // Return an observable with the response to our server
    return this.http.get(environment.apiUrl + 'users/manager/getUsers', { headers });
  }

  getUserbyId(id:string){
    // Set a header value
   const  headers = new  HttpHeaders().set("Authorization", this.authToken);
   // Add the content type: json | Add the value to a header
   headers.append('Content-Type', 'application/json');
   // Return an observable with the response to our server  
   return this.http.get(environment.apiUrl + 'users/manager/get/' + id, { headers });
   // Map the response to json
 }

 updateUser(user:User){
  // Set a header value
  const  headers = new  HttpHeaders().set("Authorization", this.authToken);
  // Add the content type: json | Add the value to a header
  headers.append('Content-Type', 'application/json');
  // Return an observable with the response to our server  
  return this.http.put(environment.apiUrl + 'users/manager/update/' + user._id, user, { headers });
  // Map the response to json
}


  deleteUser(id:string){
    // Set a header value
    const  headers = new  HttpHeaders().set("Authorization", this.authToken);
    // Add the content type: json | Add the value to a header
    headers.append('Content-Type', 'application/json');
    // Return an observable with the response to our server
    return this.http.delete(environment.apiUrl + 'users/manager/delete/' + id, { headers });
  }



  /// HELPERS

  // Function to store the data in the local storage
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Save our token and user in the component
    this.authToken = token;
    this.user = user;
  }

  // Function to get the token stored in the local storage
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    if (this.authToken){
      this.logged.next(true);
    }
  }

  loadUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getUser(): User{
    return this.user
  }

  // Function to return if the token is not expired
  loggedIn(): boolean  {
    if(!this.jwtHelper.isTokenExpired()){
      this.logged.next(true);
    }
    return !this.jwtHelper.isTokenExpired();
  }

  isLogged(){
    return this.logged.asObservable();
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.logged.next(false);
  }
}
