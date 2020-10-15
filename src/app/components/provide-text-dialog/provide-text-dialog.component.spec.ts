import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideTextDialogComponent } from './provide-text-dialog.component';

describe('ProvideTextDialogComponent', () => {
  let component: ProvideTextDialogComponent;
  let fixture: ComponentFixture<ProvideTextDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideTextDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
