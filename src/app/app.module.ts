import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CallbackPageComponent } from './pages/callback-page/callback-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { environment } from '../environments/environment';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { MatCardModule } from '@angular/material/card';
import { NewListDialogComponent } from './components/new-list-dialog/new-list-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { NewEntryDialogComponent } from './components/new-entry-dialog/new-entry-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { ListEntriesPageComponent } from './pages/list-entries-page/list-entries-page.component';
import { RequestAccessPageComponent } from './pages/request-access-page/request-access-page.component';
import { ProvideTextDialogComponent } from './components/provide-text-dialog/provide-text-dialog.component';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { ListProtocolDialogComponent } from './components/list-protocol-dialog/list-protocol-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FastEntrySheetComponent } from './components/fast-entry-sheet/fast-entry-sheet.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

@NgModule({
  declarations: [
    AdminPageComponent,
    AppComponent,
    CallbackPageComponent,
    FastEntrySheetComponent,
    ListEntriesPageComponent,
    ListProtocolDialogComponent,
    ListsPageComponent,
    LoginDialogComponent,
    NewEntryDialogComponent,
    NewListDialogComponent,
    ProvideTextDialogComponent,
    RequestAccessPageComponent,
    SettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    // AngularFireAuthModule,
    // AngularFireFunctionsModule,
    ClipboardModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveComponentModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        minWidth: '50vw',
        closeOnNavigation: true,
        disableClose: false,
        hasBackdrop: true,
      },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
