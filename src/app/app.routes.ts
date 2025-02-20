import { Routes } from '@angular/router';
import { HomePageComponent } from '@app/features/home/home-page.component';
import { CreateIdeaPageComponent } from './features/create-idea/create-idea-page.component';
import { authGuard } from './core/misc/guards/auth.guard';

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
    path: 'create-idea',
    component: CreateIdeaPageComponent,
    canActivate: [authGuard],
  },
];
