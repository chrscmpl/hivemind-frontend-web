import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';

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
];
