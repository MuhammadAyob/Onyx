import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantApplyComponent } from './applicant-apply.component';

describe('ApplicantApplyComponent', () => {
  let component: ApplicantApplyComponent;
  let fixture: ComponentFixture<ApplicantApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
