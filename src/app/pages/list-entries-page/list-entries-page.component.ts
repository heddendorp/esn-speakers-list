import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Answer,
  EntryType,
  List,
  ListEntry,
  Reaction,
  User,
} from '../../models';
import {
  catchError,
  first,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewEntryDialogComponent } from '../../components/new-entry-dialog/new-entry-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ProvideTextDialogComponent } from '../../components/provide-text-dialog/provide-text-dialog.component';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ListProtocolDialogComponent } from '../../components/list-protocol-dialog/list-protocol-dialog.component';
import { FastEntrySheetComponent } from '../../components/fast-entry-sheet/fast-entry-sheet.component';

@Component({
  selector: 'app-list-entries-page',
  templateUrl: './list-entries-page.component.html',
  styleUrls: ['./list-entries-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEntriesPageComponent {
  public list$: Observable<List>;
  public entries$: Observable<ListEntry[]>;
  public doneEntries$: Observable<ListEntry[]>;
  public user$: Observable<User>;
  public isCt$: Observable<boolean>;
  public voting$ = new BehaviorSubject(false);
  public EntryType = EntryType;

  constructor(
    auth: AuthService,
    route: ActivatedRoute,
    private store: AngularFirestore,
    private server: AngularFireFunctions,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.user$ = auth.user$;
    this.isCt$ = this.user$.pipe(map((user) => user.isAdmin || user.isCt));
    this.list$ = route.paramMap.pipe(
      switchMap((params) =>
        store
          .collection('lists')
          .doc<List>(params.get('id'))
          .valueChanges()
          .pipe(
            map((list) => ({
              ...list,
              id: params.get('id'),
            })),
            catchError((err) => {
              console.log(err);
              return of(null);
            })
          )
      )
    );
    const prepareEntries = (params) =>
      map((entries: ListEntry[]) =>
        entries.map((entry) => {
          const answers$ = store
            .collection('lists')
            .doc(params.get('id'))
            .collection('entries')
            .doc(entry.id)
            .collection<Answer>('answers')
            .valueChanges({ idField: 'id' })
            .pipe(
              withLatestFrom(this.user$),
              map(([answers, user]) =>
                answers.map((answer) => ({
                  ...answer,
                  voted: answer.votes.filter((u) => u.uid === user.uid).length,
                }))
              )
            );
          const votesLeft$ = answers$.pipe(
            withLatestFrom(this.user$),
            map(
              ([answers, user]) =>
                (entry.randomQuestion ? 1 : user.votes) -
                answers.reduce((acc, curr) => acc + curr.voted, 0)
            )
          );
          const cantVote$ = votesLeft$.pipe(map((votes) => votes <= 0));
          const reactions$ = store
            .collection('lists')
            .doc(params.get('id'))
            .collection('entries')
            .doc(entry.id)
            .collection<Reaction>('reactions', (ref) =>
              ref.orderBy('timestamp', 'asc')
            )
            .valueChanges({ idField: 'id' })
            .pipe(
              catchError((err) => {
                console.log(err);
                return of([]);
              })
            );
          return {
            ...entry,
            // @ts-ignore
            timestamp: entry.timestamp.toDate(),
            answers$,
            reactions$,
            votesLeft$,
            cantVote$,
          };
        })
      );
    this.entries$ = route.paramMap.pipe(
      switchMap((params) =>
        store
          .collection('lists')
          .doc(params.get('id'))
          .collection<ListEntry>('entries', (ref) =>
            ref
              .where('done', '==', false)
              .orderBy('type', 'asc')
              .orderBy('timestamp', 'asc')
          )
          .valueChanges({ idField: 'id' })
          .pipe(prepareEntries(params))
      )
    );
    this.doneEntries$ = route.paramMap.pipe(
      switchMap((params) =>
        store
          .collection('lists')
          .doc(params.get('id'))
          .collection<ListEntry>('entries', (ref) =>
            ref.where('done', '==', true).orderBy('timestamp', 'asc')
          )
          .valueChanges({ idField: 'id' })
          .pipe(prepareEntries(params))
      )
    );
  }

  public getId(index, item): string {
    return item.id;
  }

  public async setActiveEntry(entry: ListEntry): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    await this.store
      .collection('lists')
      .doc<List>(list.id)
      .update({ activeItem: entry.id });
  }

  public async addReaction(question: ListEntry): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    const user = await this.user$.pipe(first()).toPromise();
    const text = await this.dialog
      .open(ProvideTextDialogComponent, {
        data: { title: `Reaction to question by ${question.user.displayName}` },
      })
      .afterClosed()
      .toPromise();
    if (text) {
      await this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries')
        .doc(question.id)
        .collection('reactions')
        .add({ text, user, timestamp: new Date() });
    }
  }

  public async addEntry(): Promise<void> {
    const isCt = await this.isCt$.pipe(first()).toPromise();
    const user = await this.user$.pipe(first()).toPromise();
    const list = await this.list$.pipe(first()).toPromise();
    let res;
    if (isCt) {
      res = await this.bottomSheet
        .open(NewEntryDialogComponent, {
          data: { isCt },
        })
        .afterDismissed()
        .toPromise();
    } else {
      res = await this.bottomSheet
        .open(FastEntrySheetComponent)
        .afterDismissed()
        .toPromise();
    }
    if (res) {
      let entry: Partial<ListEntry>;
      if (isCt) {
        entry = {
          user,
          text: res.text,
          type: res.type,
          randomQuestion: res.randomQuestion,
          done: false,
          timestamp: new Date(),
          fresh: false,
        };
      } else {
        entry = {
          user,
          text: 'Currently writing text ...',
          type: res.type,
          randomQuestion: false,
          done: false,
          timestamp: new Date(),
          fresh: true,
        };
      }
      const entriesRef = this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries');
      const entryRef = await entriesRef.add(entry);
      if (res.type === EntryType.POLL) {
        const answersRef = entryRef.collection('answers');
        await Promise.all(
          res.answers.map((text) => answersRef.add({ text, votes: [] }))
        );
      }
      if (!isCt) {
        const entryWithId = { ...entry, id: entryRef.id } as ListEntry;
        await this.updateText(entryWithId);
      }
    }
  }

  async setEntryDone(entry: ListEntry, doneComment: string): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    if (list.activeItem === entry.id) {
      await this.store
        .collection('lists')
        .doc<List>(list.id)
        .update({ activeItem: null });
    }
    await this.store
      .collection('lists')
      .doc(list.id)
      .collection('entries')
      .doc<ListEntry>(entry.id)
      .update({ done: true, doneComment });
  }

  public async updateText(
    entry: ListEntry,
    reaction: Reaction = null
  ): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    const text = await this.dialog
      .open(ProvideTextDialogComponent, {
        data: {
          title: `Update Text for ${reaction ? 'reaction' : 'question'} by ${
            reaction ? reaction.user.displayName : entry.user.displayName
          }`,
          content: reaction ? reaction.text : entry.text,
        },
      })
      .afterClosed()
      .toPromise();
    if (text && !reaction) {
      await this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries')
        .doc<ListEntry>(entry.id)
        .update({ text });
    } else if (text && reaction) {
      await this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries')
        .doc<ListEntry>(entry.id)
        .collection('reactions')
        .doc<Reaction>(reaction.id)
        .update({ text });
    }
  }

  public async addAnswer(
    entry: ListEntry,
    reaction: Reaction = null
  ): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    const answer = await this.dialog
      .open(ProvideTextDialogComponent, {
        data: {
          title: `Update Answer for ${reaction ? 'reaction' : 'question'} by ${
            reaction ? reaction.user.displayName : entry.user.displayName
          }`,
          content:
            'answer' in entry
              ? reaction
                ? reaction.answer
                : entry.answer
              : '',
        },
      })
      .afterClosed()
      .toPromise();
    if (answer && reaction) {
      await this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries')
        .doc<ListEntry>(entry.id)
        .collection('reactions')
        .doc<Reaction>(reaction.id)
        .update({ answer });
    } else if (answer) {
      await this.store
        .collection('lists')
        .doc(list.id)
        .collection('entries')
        .doc<ListEntry>(entry.id)
        .update({ answer });
    }
  }

  public async recordVote(entry: ListEntry, answer: Answer): Promise<void> {
    this.voting$.next(true);
    const list = await this.list$.pipe(first()).toPromise();
    const result = await this.server
      .httpsCallable('recordVote')({
        list: list.id,
        entry: entry.id,
        answer: answer.id,
      })
      .toPromise();
    console.log(result);
    this.voting$.next(false);
  }

  public async getProtocol(): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    const entries = await this.doneEntries$.pipe(first()).toPromise();
    await this.dialog.open(ListProtocolDialogComponent, {
      panelClass: 'light',
      data: { list, entries },
    });
  }
}
