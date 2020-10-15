import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user: Observable<User>;
  private readonly authenticated: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    firestore: AngularFirestore
  ) {
    this.authenticated = auth.authState.pipe(
      map((state) => !!state),
      shareReplay()
    );
    this.user = auth.user.pipe(
      filter((user) => !!user),
      switchMap((user) =>
        firestore.collection('users').doc<User>(user.uid).valueChanges()
      ),
      shareReplay()
    );
  }

  public get authenticated$(): Observable<boolean> {
    return this.authenticated;
  }

  public get user$(): Observable<User> {
    return this.user;
  }

  public async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/start']);
  }

  public showLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }
}
