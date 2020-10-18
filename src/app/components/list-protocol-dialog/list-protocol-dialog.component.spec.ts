import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProtocolDialogComponent } from './list-protocol-dialog.component';

describe('ListProtocollDialogComponent', () => {
  let component: ListProtocolDialogComponent;
  let fixture: ComponentFixture<ListProtocolDialogComponent>;

  beforeEach(async(() => {
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
