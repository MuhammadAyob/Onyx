import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainOTPComponent } from './maintain-otp.component';

describe('MaintainOTPComponent', () => {
  let component: MaintainOTPComponent;
  let fixture: ComponentFixture<MaintainOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainOTPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
