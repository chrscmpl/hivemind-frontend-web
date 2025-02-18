import { Routes } from '@angular/router';
import { HomePageComponent } from '@app/features/home/home-page.component';
import { DialogComponent } from './core/dialog/dialog.component';
import { LoginFormComponent } from './features/auth/forms/login-form/login-form.component';
import { SignupFormComponent } from './features/auth/forms/signup-form/signup-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'auth',
    component: DialogComponent,
    outlet: 'modal',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginFormComponent,
        data: { dialogLabel: 'Login' },
      },
      {
        path: 'signup',
        component: SignupFormComponent,
        data: { dialogLabel: 'Sign up' },
      },
    ],
  },
];
