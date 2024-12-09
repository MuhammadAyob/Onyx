import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingVideoComponent } from './add-training-video.component';

describe('AddTrainingVideoComponent', () => {
  let component: AddTrainingVideoComponent;
  let fixture: ComponentFixture<AddTrainingVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrainingVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
