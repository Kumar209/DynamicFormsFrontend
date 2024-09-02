import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { CreateSourceTemplateComponent } from './create-source-template/create-source-template.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { ExistingQuestionListComponent } from './existing-question-list/existing-question-list.component';
import { authGuard } from '../guards/auth.guard';
import { EditSourceTemplateComponent } from './edit-source-template/edit-source-template.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { adminInterceptor } from '../interceptors/admin.interceptor';

const routes: Routes = [
  // {
  //   path : 'dashboard', component : DashboardComponent
  // }
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-template', component: CreateSourceTemplateComponent },
      { path: 'add-questions', component: CreateQuestionComponent },
      { path: 'existing-questions', component : ExistingQuestionListComponent },
      { path : 'edit-template', component : EditSourceTemplateComponent },
      { path : 'edit-question', component : EditQuestionComponent}
    ]
  },
  {
      path : '**' , component : NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
