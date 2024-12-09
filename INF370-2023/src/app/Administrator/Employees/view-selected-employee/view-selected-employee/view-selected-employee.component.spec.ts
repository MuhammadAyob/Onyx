import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectedEmployeeComponent } from './view-selected-employee.component';

describe('ViewSelectedEmployeeComponent', () => {
  let component: ViewSelectedEmployeeComponent;
  let fixture: ComponentFixture<ViewSelectedEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectedEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSelectedEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
