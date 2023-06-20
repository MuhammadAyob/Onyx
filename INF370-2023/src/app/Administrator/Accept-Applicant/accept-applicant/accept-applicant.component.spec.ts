import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptApplicantComponent } from './accept-applicant.component';

describe('AcceptApplicantComponent', () => {
  let component: AcceptApplicantComponent;
  let fixture: ComponentFixture<AcceptApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptApplicantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
