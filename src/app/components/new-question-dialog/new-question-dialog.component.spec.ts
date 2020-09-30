import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuestionDialogComponent } from './new-question-dialog.component';

describe('NewQuestionDialogComponent', () => {
  let component: NewQuestionDialogComponent;
  let fixture: ComponentFixture<NewQuestionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewQuestionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
