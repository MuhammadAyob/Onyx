import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillReportComponent } from './employee-skill-report.component';

describe('EmployeeSkillReportComponent', () => {
  let component: EmployeeSkillReportComponent;
  let fixture: ComponentFixture<EmployeeSkillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSkillReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSkillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
