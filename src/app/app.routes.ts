import { Routes } from '@angular/router';
import { CreateIdeaPageComponent } from '@features/create-idea/components/create-idea-page/create-idea-page.component';
import { authGuard } from '@app/core/auth/guards/auth.guard';
import { HomePageComponent } from '@features/home/components/home-page/home-page.component';
import { NotFoundPageComponent } from './features/not-found/components/not-found-page/not-found-page.component';
import { ideaResolver } from './shared/resolvers/idea.resolver';
import { IdeaPageComponent } from './features/idea-page/components/idea-page/idea-page.component';
import { uiStyleGuard } from './core/navigation/guards/ui-style.guard';
import { UIStylesEnum } from './core/navigation/enums/ui-styles.enum';
import { confirmReloadGuard } from './core/misc/guards/confirm-reload.guard';
import { doAnimateEntryResolver } from './features/idea-page/resolvers/do-animate-entry.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    title: 'HiveMind',
    canActivate: [
      uiStyleGuard(UIStylesEnum.DEFAULT),
      confirmReloadGuard(false),
    ],
    component: HomePageComponent,
  },
  {
    path: 'ideas/new',
    title: 'Post Idea',
    canActivate: [
      authGuard,
      uiStyleGuard(UIStylesEnum.BACK),
      confirmReloadGuard(true),
    ],
    component: CreateIdeaPageComponent,
  },
  {
    path: 'ideas/:id',
    children: [
      {
        path: '',
        title: 'Idea',
        canActivate: [
          uiStyleGuard(UIStylesEnum.BACK),
          confirmReloadGuard(false),
        ],
        resolve: {
          idea: ideaResolver(),
          animateEntry: doAnimateEntryResolver,
        },
        component: IdeaPageComponent,
      },
      {
        path: 'edit',
        title: 'Edit Idea',
        component: CreateIdeaPageComponent,
        canActivate: [
          uiStyleGuard(UIStylesEnum.BACK),
          confirmReloadGuard(true),
        ],
        resolve: {
          updateIdea: ideaResolver({ requireIsAuthor: true }),
        },
      },
    ],
  },
  {
    path: 'tos',
    title: 'Terms of Service',
    canActivate: [
      uiStyleGuard(UIStylesEnum.DEFAULT),
      confirmReloadGuard(false),
    ],
    loadComponent: () =>
      import('./features/info/components/tos-page/tos-page.component').then(
        (m) => m.TosPageComponent,
      ),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    canActivate: [
      uiStyleGuard(UIStylesEnum.DEFAULT),
      confirmReloadGuard(false),
    ],
    loadComponent: () =>
      import(
        './features/info/components/privacy-policy-page/privacy-policy-page.component'
      ).then((m) => m.PrivacyPolicyPageComponent),
  },
  {
    path: 'credits',
    title: 'Credits',
    canActivate: [
      uiStyleGuard(UIStylesEnum.DEFAULT),
      confirmReloadGuard(false),
    ],
    loadComponent: () =>
      import(
        './features/info/components/credits-page/credits-page.component'
      ).then((m) => m.CreditsPageComponent),
  },
  {
    path: '**',
    title: 'Not Found',
    canActivate: [
      uiStyleGuard(UIStylesEnum.DEFAULT),
      confirmReloadGuard(false),
    ],
    component: NotFoundPageComponent,
  },
];
