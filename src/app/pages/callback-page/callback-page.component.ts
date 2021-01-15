import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-callback-page',
  template: ` <p>Logging in, please wait.</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackPageComponent {
  constructor(
    route: ActivatedRoute,
    fireAuth: AngularFireAuth,
    router: Router
  ) {
    const token = route.snapshot.queryParamMap.get('token');
    if (!token) {
      router.navigate(['/start']);
    }
    fireAuth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() =>
        fireAuth
          .signInWithCustomToken(token)
          .then(() => router.navigate(['/lists']))
      );
  }
}
