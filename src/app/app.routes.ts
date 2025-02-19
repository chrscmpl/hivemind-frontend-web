import { Routes } from '@angular/router';
import { HomePageComponent } from '@app/features/home/home-page.component';

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
