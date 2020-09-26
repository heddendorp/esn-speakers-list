import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, CallbackPageComponent, ListsPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
