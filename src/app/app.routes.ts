import { Routes } from '@angular/router';
import { CreateIdeaPageComponent } from '@features/create-idea/components/create-idea-page/create-idea-page.component';
import { authGuard } from '@core/misc/guards/auth.guard';
import { HomePageComponent } from '@features/home/components/home-page/home-page.component';
import { NotFoundPageComponent } from './features/not-found/components/not-found-page/not-found-page.component';
import { CreditsPageComponent } from './features/info/components/credits-page/credits-page.component';

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
  {
    path: 'credits',
    component: CreditsPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
