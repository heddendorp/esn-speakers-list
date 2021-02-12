import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { User } from '../models';
import { transformRole } from '../helpers';

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
    private firestore: AngularFirestore
  ) {
    this.authenticated = auth.authState.pipe(
      map((state) => !!state),
      shareReplay(1)
    );
    this.user = auth.user.pipe(
      filter((user) => !!user),
      switchMap((user) =>
        firestore
          .collection('users')
          .doc<User>(user.uid)
          .valueChanges({ idField: 'id' })
      ),
      map((user) => ({
        ...user,
        selectedRoleText: transformRole(user.roles[user.selectedRole ?? 0]),
      })),
      shareReplay(1)
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

  public async updateUser(
    update: Partial<{ selectedRole: number; hidePersonalData: boolean }>
  ) {
    const { id } = await this.user$.pipe(first()).toPromise();
    await this.firestore.collection<User>('users').doc(id).update(update);
  }

  public showLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }
}
