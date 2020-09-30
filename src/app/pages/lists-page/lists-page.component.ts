import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewListDialogComponent } from '../../components/new-list-dialog/new-list-dialog.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListsPageComponent {
  public user$: Observable<any>;
  public lists$;
  public canCreateList$;
  public listIdField = new FormControl();
  constructor(
    private auth: AuthService,
    private store: AngularFirestore,
    private dialog: MatDialog,
    router: Router
  ) {
    this.listIdField.valueChanges.subscribe((id) =>
      router.navigate(['lists', id])
    );
    this.user$ = auth.user$;
    this.canCreateList$ = this.user$.pipe(
      map((user) => user.isAdmin || user.isCt)
    );
    this.lists$ = auth.user$.pipe(
      switchMap((user) => {
        if (user.isCt || user.isAdmin) {
          return store.collection('lists').valueChanges({ idField: 'id' });
        } else {
          return store
            .collection('lists', (ref) => ref.where('isOpen', '==', true))
            .valueChanges({ idField: 'id' });
        }
      })
    );
  }

  async createList(): Promise<void> {
    const listName = await this.dialog
      .open(NewListDialogComponent)
      .afterClosed()
      .toPromise();
    if (listName) {
      await this.store
        .collection('lists')
        .add({ name: listName, isHidden: true, isOpen: false });
    }
  }

  syncForm(route: ActivatedRoute): void {
    this.listIdField.setValue(route.snapshot.paramMap.get('id'), {
      emitEvent: false,
    });
  }
}
