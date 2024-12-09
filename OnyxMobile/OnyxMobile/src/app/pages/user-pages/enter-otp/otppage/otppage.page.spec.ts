import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtppagePage } from './otppage.page';

describe('OtppagePage', () => {
  let component: OtppagePage;
  let fixture: ComponentFixture<OtppagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OtppagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
