import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  public users$: Observable<User[]>;

  constructor(private store: AngularFirestore) {
    this.users$ = this.store
      .collection<User>('users', (ref) => ref.orderBy('lastName', 'asc'))
      .valueChanges();
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

  async resetApp() {
    const users = await this.store
      .collection<User>('users')
      .valueChanges()
      .pipe(first())
      .toPromise();
    await Promise.all(
      users.map((user) =>
        this.store
          .collection('users')
          .doc<User>(user.uid)
          .update({ votes: 0, hasAccess: false, isCt: false })
      )
    );
  }
}
