import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { EntryType } from '../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-question-dialog',
  templateUrl: './new-entry-dialog.component.html',
  styleUrls: ['./new-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEntryDialogComponent {
  public isCt: boolean;
  public entryForm: FormGroup;
  public availableTypes = [
    { name: 'Question', type: EntryType.QUESTION },
    { name: 'Procedural', type: EntryType.PROCEDURAL },
  ];
  public EntryType = EntryType;
  public typeSelection = new FormControl(EntryType.QUESTION);
  public pollSelected = this.typeSelection.valueChanges.pipe(
    map((val) => val === EntryType.POLL)
  );
  constructor(
    fb: FormBuilder,
    private sheet: MatBottomSheetRef<NewEntryDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { isCt: boolean }
  ) {
    this.isCt = data.isCt;
    if (this.isCt) {
      this.availableTypes = [
        ...this.availableTypes,
        { name: 'Poll', type: EntryType.POLL },
      ];
    }
    this.entryForm = fb.group({
      text: [''],
      randomQuestion: [false, Validators.required],
      answers: fb.array([
        ['Yes', Validators.required],
        ['No', Validators.required],
      ]),
    });
  }

  get answers(): FormArray {
    return this.entryForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    this.answers.push(new FormControl('', Validators.required));
  }

  removeAnswer(index): void {
    this.answers.removeAt(index);
  }

  submit(): void {
    if (this.entryForm.valid) {
      this.sheet.dismiss({
        ...this.entryForm.value,
        type: this.typeSelection.value,
      });
    }
  }
}
