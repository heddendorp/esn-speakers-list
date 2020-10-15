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
  constructor(private auth: AuthService) {
    this.hasAccess$ = auth.user$.pipe(map((user) => user.hasAccess));
  }
}
