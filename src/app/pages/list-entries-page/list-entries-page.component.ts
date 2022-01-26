import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
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
import { Functions, httpsCallable } from '@angular/fire/functions';
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
    private firestore: Firestore,
    private server: Functions,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.user$ = auth.user$;
    this.isCt$ = this.user$.pipe(map((user) => user.isAdmin || user.isCt));
    this.list$ = route.paramMap.pipe(
      switchMap((params) =>
        docData(doc(this.firestore, `lists/${params.get('id')}`), {
          idField: 'id',
        }).pipe(
          map((list) => list as List),
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
          const answers$ = collectionData(
            collection(
              this.firestore,
              `lists/${params.get('id')}/entries/${entry.id}/answers`
            ),
            { idField: 'id' }
          ).pipe(
            map((answers) => answers as Answer[]),
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
          const reactions$ = collectionData(
            query(
              collection(
                this.firestore,
                `lists/${params.get('id')}/entries/${entry.id}/reactions`
              ),
              orderBy('timestamp', 'asc')
            ),
            { idField: 'id' }
          ).pipe(
            catchError((err) => {
              console.log(err);
              return of([]);
            }),
            map((reactions) => reactions as Reaction[])
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
        collectionData(
          query(
            collection(this.firestore, `lists/${params.get('id')}/entries`),
            where('done', '==', false),
            orderBy('type', 'asc'),
            orderBy('timestamp', 'asc')
          ),
          { idField: 'id' }
        ).pipe(
          map((entries) => entries as ListEntry[]),
          prepareEntries(params)
        )
      )
    );
    this.doneEntries$ = route.paramMap.pipe(
      switchMap(
        (params) =>
          collectionData(
            query(
              collection(this.firestore, `lists/${params.get('id')}/entries`),
              where('done', '==', true),
              orderBy('timestamp', 'asc')
            ),
            { idField: 'id' }
          ).pipe(
            map((entries) => entries as ListEntry[]),
            prepareEntries(params)
          )
        // firestore
        //   .collection('lists')
        //   .doc(params.get('id'))
        //   .collection<ListEntry>('entries', (ref) =>
        //     ref.where('done', '==', true).orderBy('timestamp', 'asc')
        //   )
        //   .valueChanges({ idField: 'id' })
        //   .pipe(prepareEntries(params))
      )
    );
  }

  public getId(index, item): string {
    return item.id;
  }

  public async setActiveEntry(entry: ListEntry): Promise<void> {
    const list = await firstValueFrom(this.list$);
    await updateDoc(doc(this.firestore, `lists/${list.id}`), {
      activeItem: entry.id,
    });
    // await this.firestore
    //   .collection('lists')
    //   .doc<List>(list.id)
    //   .update({ activeItem: entry.id });
  }

  public async addReaction(question: ListEntry): Promise<void> {
    const list = await firstValueFrom(this.list$);
    const user = await firstValueFrom(this.user$);
    /*const text = await this.dialog
      .open(ProvideTextDialogComponent, {
        data: { title: `Reaction to question by ${question.user.displayName}` },
      })
      .afterClosed()
      .toPromise();*/
    // if (true) {
    const entry = { text: 'Reaction', user, timestamp: new Date() };
    const entryRef = await addDoc(
      collection(
        this.firestore,
        `lists/${list.id}/entries/${question.id}/reactions`
      ),
      entry
    );
    // const entryRef = await this.firestore
    //   .collection('lists')
    //   .doc(list.id)
    //   .collection('entries')
    //   .doc(question.id)
    //   .collection('reactions')
    //   .add(entry);
    const entryWithId = { ...entry, id: entryRef.id } as Reaction;
    await this.updateText(question, entryWithId);
    // }
  }

  public async addEntry(): Promise<void> {
    const isCt = await firstValueFrom(this.isCt$);
    const user = await firstValueFrom(this.user$);
    const list = await firstValueFrom(this.list$);
    let res;
    if (isCt) {
      res = await firstValueFrom(
        this.bottomSheet
          .open(NewEntryDialogComponent, {
            data: { isCt },
          })
          .afterDismissed()
      );
    } else {
      res = await firstValueFrom(
        this.bottomSheet.open(FastEntrySheetComponent).afterDismissed()
      );
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
      const entriesRef = collection(this.firestore, `lists/${list.id}/entries`);
      const entryRef = await addDoc(entriesRef, entry);
      if (res.type === EntryType.POLL) {
        const answersRef = collection(
          this.firestore,
          `lists/${list.id}/entries/${entryRef.id}/answers`
        );
        await Promise.all(
          res.answers.map((text) => addDoc(answersRef, { text, votes: [] }))
        );
      }
      if (!isCt) {
        const entryWithId = { ...entry, id: entryRef.id } as ListEntry;
        await this.updateText(entryWithId);
      }
    }
  }

  async setEntryDone(entry: ListEntry, doneComment: string): Promise<void> {
    const list = await firstValueFrom(this.list$);
    if (list.activeItem === entry.id) {
      await updateDoc(doc(this.firestore, `lists/${list.id}`), {
        activeItem: null,
      });
      // await this.firestore
      //   .collection('lists')
      //   .doc<List>(list.id)
      //   .update({ activeItem: null });
    }
    await updateDoc(
      doc(this.firestore, `lists/${list.id}/entries/${entry.id}`),
      {
        done: true,
        doneComment,
      }
    );
    // await this.firestore
    //   .collection('lists')
    //   .doc(list.id)
    //   .collection('entries')
    //   .doc<ListEntry>(entry.id)
    //   .update({ done: true, doneComment });
  }

  public async updateText(
    entry: ListEntry,
    reaction: Reaction = null
  ): Promise<void> {
    const list = await this.list$.pipe(first()).toPromise();
    const text = await firstValueFrom(
      this.dialog
        .open(ProvideTextDialogComponent, {
          data: {
            title: `Update Text for ${reaction ? 'reaction' : 'question'} by ${
              reaction ? reaction.user.displayName : entry.user.displayName
            }`,
            content: reaction ? reaction.text : entry.text,
          },
        })
        .afterClosed()
    );
    if (text && !reaction) {
      await updateDoc(
        doc(this.firestore, `lists/${list.id}/entries/${entry.id}`),
        {
          text,
        }
      );
      // await this.firestore
      //   .collection('lists')
      //   .doc(list.id)
      //   .collection('entries')
      //   .doc<ListEntry>(entry.id)
      //   .update({ text });
    } else if (text && reaction) {
      await updateDoc(
        doc(
          this.firestore,
          `lists/${list.id}/entries/${entry.id}/reactions/${reaction.id}`
        ),
        {
          text,
        }
      );
      // await this.firestore
      //   .collection('lists')
      //   .doc(list.id)
      //   .collection('entries')
      //   .doc<ListEntry>(entry.id)
      //   .collection('reactions')
      //   .doc<Reaction>(reaction.id)
      //   .update({ text });
    }
  }

  public async addAnswer(
    entry: ListEntry,
    reaction: Reaction = null
  ): Promise<void> {
    const list = await firstValueFrom(this.list$);
    const answer = await firstValueFrom(
      await this.dialog
        .open(ProvideTextDialogComponent, {
          data: {
            title: `Update Answer for ${
              reaction ? 'reaction' : 'question'
            } by ${
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
    );
    if (answer && reaction) {
      await updateDoc(
        doc(
          this.firestore,
          `lists/${list.id}/entries/${entry.id}/reactions/${reaction.id}`
        ),
        {
          answer,
        }
      );
      // await this.firestore
      //   .collection('lists')
      //   .doc(list.id)
      //   .collection('entries')
      //   .doc<ListEntry>(entry.id)
      //   .collection('reactions')
      //   .doc<Reaction>(reaction.id)
      //   .update({ answer });
    } else if (answer) {
      await updateDoc(
        doc(this.firestore, `lists/${list.id}/entries/${entry.id}`),
        {
          answer,
        }
      );
      // await this.firestore
      //   .collection('lists')
      //   .doc(list.id)
      //   .collection('entries')
      //   .doc<ListEntry>(entry.id)
      //   .update({ answer });
    }
  }

  public async recordVote(entry: ListEntry, answer: Answer): Promise<void> {
    this.voting$.next(true);
    const list = await firstValueFrom(this.list$);
    const result = await httpsCallable(
      this.server,
      'recordVote'
    )({
      listId: list.id,
      entryId: entry.id,
      answerId: answer.id,
    });
    // const result = await this.server
    //   .httpsCallable('recordVote')({
    //     list: list.id,
    //     entry: entry.id,
    //     answer: answer.id,
    //   })
    //   .toPromise();
    console.log(result);
    this.voting$.next(false);
  }

  public async getProtocol(): Promise<void> {
    const list = await firstValueFrom(this.list$);
    const entries = await firstValueFrom(this.doneEntries$);
    await this.dialog.open(ListProtocolDialogComponent, {
      panelClass: 'light',
      data: { list, entries },
    });
  }
}
