import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'auth/login', pathMatch: 'full' 
    },
    {
        path : 'auth', loadChildren : () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path : 'admin', loadChildren : () => import('./admin/admin.module').then(m=> m.AdminModule)
    },
    {
        path : 'form-response' , loadChildren : () => import('./form-response/form-response.module').then(m => m.FormResponseModule)
    },
    {
        path : '**' , component : NotFoundComponent
    }
];
