import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserCrendentail } from '../interface/IUserCredential';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  public authSecretKey = 'BearerToken';

  baseUrl : string = "https://localhost:44353/api/Auth";

  constructor(private http:HttpClient) 
  { 
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }


  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }


  login(userCredential : IUserCrendentail) : Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/LoginUser` , userCredential)
  }

  
  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    localStorage.removeItem("UserDetails");
    this.isAuthenticated = false;
  }
}
