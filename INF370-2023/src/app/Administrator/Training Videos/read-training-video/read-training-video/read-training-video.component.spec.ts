import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadTrainingVideoComponent } from './read-training-video.component';

describe('ReadTrainingVideoComponent', () => {
  let component: ReadTrainingVideoComponent;
  let fixture: ComponentFixture<ReadTrainingVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadTrainingVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTrainingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
