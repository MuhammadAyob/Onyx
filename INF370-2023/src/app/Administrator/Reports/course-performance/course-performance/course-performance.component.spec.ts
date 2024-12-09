import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePerformanceComponent } from './course-performance.component';

describe('CoursePerformanceComponent', () => {
  let component: CoursePerformanceComponent;
  let fixture: ComponentFixture<CoursePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursePerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
