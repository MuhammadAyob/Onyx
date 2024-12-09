import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadStudentsComponent } from './read-students.component';

describe('ReadStudentsComponent', () => {
  let component: ReadStudentsComponent;
  let fixture: ComponentFixture<ReadStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
