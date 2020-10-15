import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-provide-text-dialog',
  templateUrl: './provide-text-dialog.component.html',
  styleUrls: ['./provide-text-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvideTextDialogComponent {
  public textControl = new FormControl('', Validators.required);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content?: string }
  ) {
    if (data.content) {
      this.textControl.patchValue(data.content);
    }
  }
}
