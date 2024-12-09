import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseContentComponent } from './view-course-content.component';

describe('ViewCourseContentComponent', () => {
  let component: ViewCourseContentComponent;
  let fixture: ComponentFixture<ViewCourseContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCourseContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
