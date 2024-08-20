import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratedFormComponent } from './generated-form/generated-form.component';

const routes: Routes = [
  {
    path : 'generated-form' , component : GeneratedFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormResponseRoutingModule { }
