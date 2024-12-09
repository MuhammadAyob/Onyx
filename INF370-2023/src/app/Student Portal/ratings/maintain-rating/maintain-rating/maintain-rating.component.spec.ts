import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainRatingComponent } from './maintain-rating.component';

describe('MaintainRatingComponent', () => {
  let component: MaintainRatingComponent;
  let fixture: ComponentFixture<MaintainRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
