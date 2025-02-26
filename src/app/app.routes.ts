import { Routes } from '@angular/router';
import { CreateIdeaPageComponent } from '@features/create-idea/components/create-idea-page/create-idea-page.component';
import { authGuard } from '@core/misc/guards/auth.guard';
import { HomePageComponent } from '@features/home/components/home-page/home-page.component';
import { NotFoundPageComponent } from './features/not-found/components/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    title: 'HiveMind',
    component: HomePageComponent,
  },
  {
    path: 'idea/new',
    title: 'Post Idea',
    component: CreateIdeaPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tos',
    title: 'Terms of Service',
    loadComponent: () =>
      import('./features/info/components/tos-page/tos-page.component').then(
        (m) => m.TosPageComponent,
      ),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    loadComponent: () =>
      import(
        './features/info/components/privacy-policy-page/privacy-policy-page.component'
      ).then((m) => m.PrivacyPolicyPageComponent),
  },
  {
    path: 'credits',
    title: 'Credits',
    loadComponent: () =>
      import(
        './features/info/components/credits-page/credits-page.component'
      ).then((m) => m.CreditsPageComponent),
  },
  {
    path: '**',
    title: 'Not Found',
    component: NotFoundPageComponent,
  },
];
