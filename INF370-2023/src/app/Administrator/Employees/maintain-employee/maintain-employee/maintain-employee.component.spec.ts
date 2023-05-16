import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainEmployeeComponent } from './maintain-employee.component';

describe('MaintainEmployeeComponent', () => {
  let component: MaintainEmployeeComponent;
  let fixture: ComponentFixture<MaintainEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
