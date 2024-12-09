import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSlotComponent } from './maintain-slot.component';

describe('MaintainSlotComponent', () => {
  let component: MaintainSlotComponent;
  let fixture: ComponentFixture<MaintainSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
