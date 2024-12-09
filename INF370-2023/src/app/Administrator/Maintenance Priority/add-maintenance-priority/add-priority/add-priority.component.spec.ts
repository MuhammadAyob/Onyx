import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriorityComponent } from './add-priority.component';

describe('AddPriorityComponent', () => {
  let component: AddPriorityComponent;
  let fixture: ComponentFixture<AddPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPriorityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
