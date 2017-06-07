import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSearchComponent } from './agent-search.component';

describe('AgentSearchComponent', () => {
  let component: AgentSearchComponent;
  let fixture: ComponentFixture<AgentSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
