import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-access-requests-page',
  templateUrl: './access-requests-page.component.html',
  styleUrls: ['./access-requests-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessRequestsPageComponent {
  public requests$;
  constructor(private store: AngularFirestore) {
    this.requests$ = store.collection('access-requests').valueChanges();
  }

  async approveRequest({ user }): Promise<void> {
    await this.store.collection('access-requests').doc(user.uid).delete();
    await this.store
      .collection('users')
      .doc(user.uid)
      .update({ hasAccess: true });
  }
}
