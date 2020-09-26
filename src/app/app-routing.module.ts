import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';

const routes: Routes = [
  { path: 'callback', component: CallbackPageComponent },
  { path: 'lists', component: ListsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
