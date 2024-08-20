import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { CreateSourceTemplateComponent } from './create-source-template/create-source-template.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { ExistingQuestionListComponent } from './existing-question-list/existing-question-list.component';
import { authGuard } from '../guards/auth.guard';
import { EditSourceTemplateComponent } from './edit-source-template/edit-source-template.component';

const routes: Routes = [
  // {
  //   path : 'dashboard', component : DashboardComponent
  // }
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate : [authGuard] },
      { path: 'create-template', component: CreateSourceTemplateComponent },
      { path: 'add-questions', component: CreateQuestionComponent },
      { path: 'existing-questions', component : ExistingQuestionListComponent },
      { path : 'edit-template', component : EditSourceTemplateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
