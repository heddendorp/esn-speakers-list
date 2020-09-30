import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestsPageComponent } from './access-requests-page.component';

describe('AccessRequestsPageComponent', () => {
  let component: AccessRequestsPageComponent;
  let fixture: ComponentFixture<AccessRequestsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRequestsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRequestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
