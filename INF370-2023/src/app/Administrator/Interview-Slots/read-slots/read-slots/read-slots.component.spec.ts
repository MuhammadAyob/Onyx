import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadSlotsComponent } from './read-slots.component';

describe('ReadSlotsComponent', () => {
  let component: ReadSlotsComponent;
  let fixture: ComponentFixture<ReadSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
