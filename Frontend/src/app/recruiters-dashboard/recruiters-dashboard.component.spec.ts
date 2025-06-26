import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitersDashboardComponent } from './recruiters-dashboard.component';

describe('RecruitersDashboardComponent', () => {
  let component: RecruitersDashboardComponent;
  let fixture: ComponentFixture<RecruitersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitersDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
