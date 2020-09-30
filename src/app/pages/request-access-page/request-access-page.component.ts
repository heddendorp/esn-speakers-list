import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, exhaustMap, first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-request-access-page',
  templateUrl: './request-access-page.component.html',
  styleUrls: ['./request-access-page.component.scss'],
})
export class RequestAccessPageComponent {
  public hasAccess$: Observable<boolean>;
  public accessRequest$: Observable<any>;
  constructor(private auth: AuthService, private store: AngularFirestore) {
    this.hasAccess$ = auth.user$.pipe(map((user) => user.hasAccess));
    this.accessRequest$ = auth.user$.pipe(
      exhaustMap((user) =>
        store.collection('access-requests').doc(user.uid).valueChanges()
      )
    );
  }

  async sendAccessRequest(): Promise<void> {
    const user = await this.auth.user$.pipe(first()).toPromise();
    await this.store.collection('access-requests').doc(user.uid).set({
      user,
      timestamp: new Date(),
    });
  }
}
