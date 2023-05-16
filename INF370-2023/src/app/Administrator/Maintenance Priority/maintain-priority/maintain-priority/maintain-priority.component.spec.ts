import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainPriorityComponent } from './maintain-priority.component';

describe('MaintainPriorityComponent', () => {
  let component: MaintainPriorityComponent;
  let fixture: ComponentFixture<MaintainPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainPriorityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
