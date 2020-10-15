import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntryDialogComponent } from './new-entry-dialog.component';

describe('NewQuestionDialogComponent', () => {
  let component: NewEntryDialogComponent;
  let fixture: ComponentFixture<NewEntryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEntryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
