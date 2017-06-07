import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAssignedListComponent } from './site-assigned-list.component';

describe('SiteAssignedListComponent', () => {
  let component: SiteAssignedListComponent;
  let fixture: ComponentFixture<SiteAssignedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAssignedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAssignedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
