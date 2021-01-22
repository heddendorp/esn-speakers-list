import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-list-dialog',
  template: ` <h1 mat-dialog-title>Create Speakers list</h1>
    <mat-dialog-content>
      <mat-form-field style="width: 100%;">
        <mat-label>List Name</mat-label>
        <input matInput type="text" [formControl]="nameControl" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-stroked-button
        [mat-dialog-close]="nameControl.valueChanges | async"
        color="primary"
        [disabled]="nameControl.invalid"
      >
        Create List
      </button>
      <button mat-stroked-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewListDialogComponent {
  public nameControl = new FormControl('', Validators.required);
}
