import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCourseComponent } from './read-course.component';

describe('ReadCourseComponent', () => {
  let component: ReadCourseComponent;
  let fixture: ComponentFixture<ReadCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
