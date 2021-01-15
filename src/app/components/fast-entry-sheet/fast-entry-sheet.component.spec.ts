import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastEntrySheetComponent } from './fast-entry-sheet.component';

describe('FastEntrySheetComponent', () => {
  let component: FastEntrySheetComponent;
  let fixture: ComponentFixture<FastEntrySheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FastEntrySheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastEntrySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
