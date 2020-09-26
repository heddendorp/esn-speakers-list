import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-callback-page',
  template: `
    <p>
      Logging in, please wait.
    </p>
  `,
  styles: [],
})
export class CallbackPageComponent {
  constructor(route: ActivatedRoute, auth: AngularFireAuth, router: Router) {
    auth
      .signInWithCustomToken(route.snapshot.queryParamMap.get('token'))
      .then(() => router.navigate(['/lists']));
  }
}
