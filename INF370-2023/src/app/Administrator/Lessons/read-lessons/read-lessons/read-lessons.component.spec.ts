import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadLessonsComponent } from './read-lessons.component';

describe('ReadLessonsComponent', () => {
  let component: ReadLessonsComponent;
  let fixture: ComponentFixture<ReadLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadLessonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
