import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadJobsComponent } from './read-jobs.component';

describe('ReadJobsComponent', () => {
  let component: ReadJobsComponent;
  let fixture: ComponentFixture<ReadJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
