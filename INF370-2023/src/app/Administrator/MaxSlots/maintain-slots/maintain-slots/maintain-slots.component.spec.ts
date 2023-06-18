import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSlotsComponent } from './maintain-slots.component';

describe('MaintainSlotsComponent', () => {
  let component: MaintainSlotsComponent;
  let fixture: ComponentFixture<MaintainSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
