import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EntryType } from '../../models';

@Component({
  selector: 'app-fast-entry-sheet',
  template: ` <h2>New List entry</h2>
    <div fxLayout="column" fxLayoutGap="1rem" style="width: 100%;">
      <button
        mat-flat-button
        color="primary"
        (click)="closeWithType(entryType.QUESTION)"
      >
        Submit Question</button
      ><button
        mat-flat-button
        color="primary"
        (click)="closeWithType(entryType.PROCEDURAL)"
      >
        Submit Procedural
      </button>
    </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FastEntrySheetComponent {
  public entryType = EntryType;
  constructor(private sheet: MatBottomSheetRef<FastEntrySheetComponent>) {}

  closeWithType(type: EntryType) {
    this.sheet.dismiss({ type });
  }
}
