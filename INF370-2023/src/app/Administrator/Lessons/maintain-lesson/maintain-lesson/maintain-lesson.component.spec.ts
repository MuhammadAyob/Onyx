import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainLessonComponent } from './maintain-lesson.component';

describe('MaintainLessonComponent', () => {
  let component: MaintainLessonComponent;
  let fixture: ComponentFixture<MaintainLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainLessonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
