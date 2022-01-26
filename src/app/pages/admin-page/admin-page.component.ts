import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../../models';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  public users$: Observable<User[]>;
  public production = environment.production;

  constructor(private firestore: Firestore) {
    this.users$ = collectionData(
      query(collection(this.firestore, 'users'), orderBy('lastName', 'asc')),
      { idField: 'id' }
    ).pipe(map((users) => users as User[]));
    // this.users$ = this.firestore
    //   .collection<User>('users', (ref) => ref.orderBy('lastName', 'asc'))
    //   .valueChanges();
  }

  async setAccess(user: User, hasAccess: boolean): Promise<void> {
    await updateDoc(doc(this.firestore, `users/${user.uid}`), {
      hasAccess,
    });
    // await this.firestore
    //   .collection('users')
    //   .doc<User>(user.uid)
    //   .update({ hasAccess });
  }

  async setCt(user: User, isCt: boolean): Promise<void> {
    await updateDoc(doc(this.firestore, `users/${user.uid}`), {
      isCt,
    });
    // await this.firestore
    //   .collection('users')
    //   .doc<User>(user.uid)
    //   .update({ isCt });
  }

  async setVotes(user: User, votes: number): Promise<void> {
    await updateDoc(doc(this.firestore, `users/${user.uid}`), {
      votes,
    });
    // await this.firestore
    //   .collection('users')
    //   .doc<User>(user.uid)
    //   .update({ votes });
  }

  async resetApp() {
    const users = await firstValueFrom(
      collectionData(collection(this.firestore, 'users'))
    );
    // const users = await this.firestore
    //   .collection<User>('users')
    //   .valueChanges()
    //   .pipe(first())
    //   .toPromise();
    await Promise.all(
      users.map(
        (user) =>
          updateDoc(doc(this.firestore, `users/${user.uid}`), {
            hasAccess: false,
            isCt: false,
            votes: 0,
          })
        // this.firestore
        //   .collection('users')
        //   .doc<User>(user.uid)
        //   .update({ votes: 0, hasAccess: false, isCt: false })
      )
    );
  }
}
