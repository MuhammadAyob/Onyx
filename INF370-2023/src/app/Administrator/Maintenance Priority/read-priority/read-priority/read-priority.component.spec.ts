import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadPriorityComponent } from './read-priority.component';

describe('ReadPriorityComponent', () => {
  let component: ReadPriorityComponent;
  let fixture: ComponentFixture<ReadPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadPriorityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
