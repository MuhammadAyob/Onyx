import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMaintenanceTypesComponent } from './read-maintenance-types.component';

describe('ReadMaintenanceTypesComponent', () => {
  let component: ReadMaintenanceTypesComponent;
  let fixture: ComponentFixture<ReadMaintenanceTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadMaintenanceTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadMaintenanceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
