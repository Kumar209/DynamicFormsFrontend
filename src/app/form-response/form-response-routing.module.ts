import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratedFormComponent } from './generated-form/generated-form.component';
import { FormResponseListComponent } from './form-response-list/form-response-list.component';
import { SingleResponseComponent } from './single-response/single-response.component';

const routes: Routes = [
  {
    path : 'generated-form' , component : GeneratedFormComponent
  },
  {
    path : 'form-response-list' , component : FormResponseListComponent
  },
  {
    path : 'single-response', component : SingleResponseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormResponseRoutingModule { }


