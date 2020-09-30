import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewQuestionDialogComponent } from '../../components/new-question-dialog/new-question-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsPageComponent {
  public list$;
  public questions$;
  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private sheet: MatBottomSheet,
    private route: ActivatedRoute
  ) {
    this.list$ = route.paramMap.pipe(
      switchMap((params) =>
        firestore.collection('lists').doc(params.get('id')).valueChanges()
      )
    );
    this.questions$ = route.paramMap.pipe(
      switchMap((params) =>
        firestore
          .collection('lists')
          .doc(params.get('id'))
          .collection('questions')
          .valueChanges()
      )
    );
  }

  async newQuestion(): Promise<void> {
    const question = await this.sheet
      .open(NewQuestionDialogComponent)
      .afterDismissed()
      .toPromise();
    if (question) {
      const user = await this.auth.user$.pipe(first()).toPromise();
      const listId = await this.route.paramMap
        .pipe(
          map((params) => params.get('id')),
          first()
        )
        .toPromise();
      await this.firestore
        .collection('lists')
        .doc(listId)
        .collection('questions')
        .add({ ...question, user, timestamp: new Date() });
    }
  }
}
