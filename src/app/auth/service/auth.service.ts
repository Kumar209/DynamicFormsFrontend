import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IUserCrendentail } from '../interface/IUserCredential';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  public authSecretKey = 'BearerToken';

  baseUrl : string = "https://localhost:44353/api/Auth";

  constructor(private http:HttpClient, private cookieService: CookieService, private router : Router) 
  { 
    const token = this.getToken();
    this.isAuthenticated = !!token;
  }


  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }


  private storeToken(token: string): void {
    this.cookieService.set(this.authSecretKey, token, 1, '/');   //Expires in 1 day
  }

  private getToken(): string | null {
    return this.cookieService.get(this.authSecretKey);
  }

  private deleteToken(): void {
    this.cookieService.delete(this.authSecretKey, '/');
  }




  login(userCredential: IUserCrendentail): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/LoginUser`, userCredential).pipe(
      tap((response : any) => {
        const jwtToken = response.token; // Adjust this based on your actual response structure
        if (jwtToken) {
          this.storeToken(jwtToken);
        }
      })
    );
  }

  
  logout(): void {
    this.deleteToken();
    this.isAuthenticated = false;
    this.router.navigate(['auth/login']);
  }
}
