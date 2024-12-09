import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainMaintenanceTypeComponent } from './maintain-maintenance-type.component';

describe('MaintainMaintenanceTypeComponent', () => {
  let component: MaintainMaintenanceTypeComponent;
  let fixture: ComponentFixture<MaintainMaintenanceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainMaintenanceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainMaintenanceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
