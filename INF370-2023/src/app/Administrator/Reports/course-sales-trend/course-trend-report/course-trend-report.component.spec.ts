import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTrendReportComponent } from './course-trend-report.component';

describe('CourseTrendReportComponent', () => {
  let component: CourseTrendReportComponent;
  let fixture: ComponentFixture<CourseTrendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseTrendReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseTrendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
