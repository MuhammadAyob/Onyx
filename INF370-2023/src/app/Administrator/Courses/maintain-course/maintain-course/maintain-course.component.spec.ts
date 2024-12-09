import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCourseComponent } from './maintain-course.component';

describe('MaintainCourseComponent', () => {
  let component: MaintainCourseComponent;
  let fixture: ComponentFixture<MaintainCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
