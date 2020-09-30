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
import { StartPageComponent } from './pages/start-page/start-page.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RequestAccessPageComponent } from './pages/request-access-page/request-access-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AccessRequestsPageComponent } from './pages/access-requests-page/access-requests-page.component';
import { MatCardModule } from '@angular/material/card';
import { NewListDialogComponent } from './components/new-list-dialog/new-list-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { QuestionsPageComponent } from './pages/questions-page/questions-page.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { NewQuestionDialogComponent } from './components/new-question-dialog/new-question-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [
    AppComponent,
    CallbackPageComponent,
    ListsPageComponent,
    StartPageComponent,
    LoginDialogComponent,
    RequestAccessPageComponent,
    AccessRequestsPageComponent,
    NewListDialogComponent,
    QuestionsPageComponent,
    NewQuestionDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    ReactiveComponentModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatBottomSheetModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
