import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { CreateSourceTemplateComponent } from './create-source-template/create-source-template.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { ExistingQuestionListComponent } from './existing-question-list/existing-question-list.component';
import { authGuard } from '../guards/auth.guard';

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
      { path: 'existing-questions', component : ExistingQuestionListComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
