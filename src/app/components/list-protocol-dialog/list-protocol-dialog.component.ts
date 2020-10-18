import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntryType, List, ListEntry } from '../../models';

@Component({
  selector: 'app-list-protocoll-dialog',
  templateUrl: './list-protocol-dialog.component.html',
  styleUrls: ['./list-protocol-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListProtocolDialogComponent {
  public EntryType = EntryType;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { list: List; entries: ListEntry[] }
  ) {}
}
