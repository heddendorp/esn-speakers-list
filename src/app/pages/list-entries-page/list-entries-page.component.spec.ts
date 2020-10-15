import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntriesPageComponent } from './list-entries-page.component';

describe('ListEntriesPageComponent', () => {
  let component: ListEntriesPageComponent;
  let fixture: ComponentFixture<ListEntriesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEntriesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
