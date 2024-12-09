import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTrainingVideoComponent } from './maintain-training-video.component';

describe('MaintainTrainingVideoComponent', () => {
  let component: MaintainTrainingVideoComponent;
  let fixture: ComponentFixture<MaintainTrainingVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainTrainingVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainTrainingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
