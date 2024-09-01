import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { adminInterceptor } from '../interceptors/admin.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  providers : [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: adminInterceptor,
      multi: true
    }
  ]
})
export class AdminModule { }
