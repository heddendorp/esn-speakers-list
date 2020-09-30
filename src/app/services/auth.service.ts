import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  exhaustMap,
  filter,
  map,
  share,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user;
  private readonly authenticated;
  constructor(
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    firestore: AngularFirestore
  ) {
    this.authenticated = auth.authState.pipe(
      map((state) => !!state),
      shareReplay(1)
    );
    this.user = auth.user.pipe(
      filter((user) => !!user),
      switchMap((user) =>
        firestore.collection('users').doc(user.uid).valueChanges()
      ),
      shareReplay(1)
    );
  }

  public get authenticated$(): Observable<boolean> {
    return this.authenticated;
  }

  public get user$(): Observable<any> {
    return this.user;
  }

  public async logout(): Promise<any> {
    await this.auth.signOut();
    return await this.router.navigate(['/start']);
  }

  public showLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }
}
