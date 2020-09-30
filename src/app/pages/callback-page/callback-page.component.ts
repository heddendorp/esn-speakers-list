import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-callback-page',
  template: `
    <p>
      Logging in, please wait.
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackPageComponent {
  constructor(route: ActivatedRoute, auth: AngularFireAuth, router: Router) {
    const token = route.snapshot.queryParamMap.get('token');
    if (!token) {
      router.navigate(['/start']);
    }
    auth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() =>
        auth
          .signInWithCustomToken(token)
          .then(() => router.navigate(['/lists']))
      );
  }
}
