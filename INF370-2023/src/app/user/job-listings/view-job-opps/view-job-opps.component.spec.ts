import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobOppsComponent } from './view-job-opps.component';

describe('ViewJobOppsComponent', () => {
  let component: ViewJobOppsComponent;
  let fixture: ComponentFixture<ViewJobOppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJobOppsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJobOppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
