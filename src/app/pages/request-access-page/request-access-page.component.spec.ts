import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccessPageComponent } from './request-access-page.component';

describe('RequestAccessPageComponent', () => {
  let component: RequestAccessPageComponent;
  let fixture: ComponentFixture<RequestAccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
