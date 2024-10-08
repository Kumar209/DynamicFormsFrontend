import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormResponseRoutingModule } from './form-response-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { formResponseInterceptor } from '../interceptors/form-response.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormResponseRoutingModule
  ]
})
export class FormResponseModule { }
