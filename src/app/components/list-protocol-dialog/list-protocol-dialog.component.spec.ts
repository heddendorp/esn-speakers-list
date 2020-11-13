import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListProtocolDialogComponent } from './list-protocol-dialog.component';

describe('ListProtocollDialogComponent', () => {
  let component: ListProtocolDialogComponent;
  let fixture: ComponentFixture<ListProtocolDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProtocolDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProtocolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
