import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-new-question-dialog',
  templateUrl: './new-question-dialog.component.html',
  styleUrls: ['./new-question-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewQuestionDialogComponent {
  public questionForm: FormGroup;
  constructor(
    fb: FormBuilder,
    private sheet: MatBottomSheetRef<NewQuestionDialogComponent>
  ) {
    this.questionForm = fb.group({
      text: ['', Validators.required],
      type: ['question', Validators.required],
    });
  }

  submit(): void {
    if (this.questionForm.valid) {
      this.sheet.dismiss(this.questionForm.value);
    }
  }
}
