import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDepartmentComponent } from './read-department.component';

describe('ReadDepartmentComponent', () => {
  let component: ReadDepartmentComponent;
  let fixture: ComponentFixture<ReadDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
