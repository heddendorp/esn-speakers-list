import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewListDialogComponent } from './new-list-dialog.component';

describe('NewListDialogComponent', () => {
  let component: NewListDialogComponent;
  let fixture: ComponentFixture<NewListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
