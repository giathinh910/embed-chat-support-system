import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCreateComponent } from './site-create.component';

describe('SiteCreateComponent', () => {
  let component: SiteCreateComponent;
  let fixture: ComponentFixture<SiteCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
