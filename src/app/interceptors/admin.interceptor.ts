import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const adminInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor is being called');
  
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);


  let authToken = authService.getToken();

  console.log('Interceptor called. Token:', authToken);


  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    console.log('Modified request:', req);
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
