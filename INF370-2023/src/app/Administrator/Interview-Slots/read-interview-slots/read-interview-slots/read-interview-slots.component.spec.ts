import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadInterviewSlotsComponent } from './read-interview-slots.component';

describe('ReadInterviewSlotsComponent', () => {
  let component: ReadInterviewSlotsComponent;
  let fixture: ComponentFixture<ReadInterviewSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadInterviewSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadInterviewSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
