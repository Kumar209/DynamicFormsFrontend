import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const formResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);



  //If url link is to insertResponse then it doesnt sent token in header
  if (req.url.includes('/InsertResponse')) {
    return next(req);
  }



  let authToken = authService.getToken();


  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }
  
  
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toastr.warning('Session expired. Please login again!');

        // Clear tokens from cookies
        authService.deleteToken();
        

        // Navigate to the login page
        router.navigate(['auth/login']);
      }

      return throwError(() => new Error(error.message));
    })
  );
};
