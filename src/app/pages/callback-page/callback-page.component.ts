import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Auth,
  browserLocalPersistence,
  setPersistence,
  signInWithCustomToken,
} from '@angular/fire/auth';

@Component({
  selector: 'app-callback-page',
  template: ` <p>Logging in, please wait.</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackPageComponent {
  constructor(route: ActivatedRoute, private auth: Auth, router: Router) {
    const token = route.snapshot.queryParamMap.get('token');
    if (!token) {
      router.navigate(['/start']);
    }
    // setPersistence(this.auth, browserLocalPersistence).then(() => {
    signInWithCustomToken(this.auth, token).then(() =>
      router.navigate(['/lists'])
    );
    // });
    // auth
    //   .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    //   .then(() =>
    //     signInWithCustomToken(this.auth, token)
    //       .then(() => router.navigate(['/lists']))
    //   );
  }
}
