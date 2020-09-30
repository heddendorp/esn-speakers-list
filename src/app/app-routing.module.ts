import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RequestAccessPageComponent } from './pages/request-access-page/request-access-page.component';
import { AccessGuard } from './services/access.guard';
import { AccessRequestsPageComponent } from './pages/access-requests-page/access-requests-page.component';
import { AdminGuard } from './services/admin.guard';
import { QuestionsPageComponent } from './pages/questions-page/questions-page.component';

const routes: Routes = [
  { path: 'start', component: StartPageComponent },
  { path: 'request-access', component: RequestAccessPageComponent },
  {
    path: 'access-requests',
    component: AccessRequestsPageComponent,
    // canActivate: [AdminGuard],
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
    children: [{ path: ':id', component: QuestionsPageComponent }],
  },
  { path: '', pathMatch: 'full', redirectTo: 'lists' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
