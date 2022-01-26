import { Injectable } from '@angular/core';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { User } from '../models';
import { transformRole } from '../helpers';
import { Auth, authState, user } from '@angular/fire/auth';
import {
  doc,
  docData,
  docSnapshots,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user: Observable<User>;
  private readonly authenticated: Observable<boolean>;

  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private router: Router,
    private firestore: Firestore
  ) {
    this.authenticated = authState(this.auth).pipe(
      map((state) => !!state),
      shareReplay(1)
    );
    this.user = user(this.auth).pipe(
      filter((user) => !!user),
      switchMap((user) =>
        docData(doc(this.firestore, `users/${user.uid}`), {
          idField: 'id',
        }).pipe(map((user) => user as User))
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
    const { id } = await firstValueFrom(this.user$);
    await updateDoc(doc(this.firestore, `users/${id}`), update);
    // await this.firestore.collection<User>('users').doc(id).update(update);
  }

  public showLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }
}
