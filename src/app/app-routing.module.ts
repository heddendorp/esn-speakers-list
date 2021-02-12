import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { AccessGuard } from './services/access.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminGuard } from './services/admin.guard';
import { ListEntriesPageComponent } from './pages/list-entries-page/list-entries-page.component';
import { RequestAccessPageComponent } from './pages/request-access-page/request-access-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  { path: 'request-access', component: RequestAccessPageComponent },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'callback',
    component: CallbackPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['/lists']) },
  },
  {
    path: 'lists',
    component: ListsPageComponent,
    canActivate: [AngularFireAuthGuard, AccessGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['/start']) },
    children: [{ path: ':id', component: ListEntriesPageComponent }],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['/start']) },
  },
  {
    path: 'start',
    loadChildren: () =>
      import('./modules/start/start.module').then((m) => m.StartModule),
  },
  {
    path: 'learn',
    loadChildren: () =>
      import('./modules/learn/learn.module').then((m) => m.LearnModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'lists' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
