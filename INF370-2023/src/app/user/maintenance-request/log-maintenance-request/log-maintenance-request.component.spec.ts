import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMaintenanceRequestComponent } from './log-maintenance-request.component';

describe('LogMaintenanceRequestComponent', () => {
  let component: LogMaintenanceRequestComponent;
  let fixture: ComponentFixture<LogMaintenanceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogMaintenanceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogMaintenanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
