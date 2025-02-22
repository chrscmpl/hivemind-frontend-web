import { Routes } from '@angular/router';
import { CreateIdeaPageComponent } from '@features/create-idea/components/create-idea-page/create-idea-page.component';
import { authGuard } from '@core/misc/guards/auth.guard';
import { HomePageComponent } from '@features/home/components/home-page/home-page.component';

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
    path: 'idea/new',
    component: CreateIdeaPageComponent,
    canActivate: [authGuard],
  },
];
