import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainDepartmentComponent } from './maintain-department.component';

describe('MaintainDepartmentComponent', () => {
  let component: MaintainDepartmentComponent;
  let fixture: ComponentFixture<MaintainDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
