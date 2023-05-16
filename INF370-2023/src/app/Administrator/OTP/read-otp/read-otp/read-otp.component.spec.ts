import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOTPComponent } from './read-otp.component';

describe('ReadOTPComponent', () => {
  let component: ReadOTPComponent;
  let fixture: ComponentFixture<ReadOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOTPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
