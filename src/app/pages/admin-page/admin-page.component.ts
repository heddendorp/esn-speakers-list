import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  public users$: Observable<User[]>;

  constructor(private store: AngularFirestore) {
    this.users$ = this.store.collection<User>('users').valueChanges();
  }

  async setAccess(user: User, hasAccess: boolean): Promise<void> {
    await this.store
      .collection('users')
      .doc<User>(user.uid)
      .update({ hasAccess });
  }

  async setCt(user: User, isCt: boolean): Promise<void> {
    await this.store.collection('users').doc<User>(user.uid).update({ isCt });
  }

  async setVotes(user: User, votes: number): Promise<void> {
    await this.store.collection('users').doc<User>(user.uid).update({ votes });
  }
}
