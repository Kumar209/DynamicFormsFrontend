import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService as BusyServiceType } from '../core/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyServiceType);

  busyService.busy();

  return next(req).pipe(
    // delay(2000),
    finalize(() => busyService.idle())
  )
};
