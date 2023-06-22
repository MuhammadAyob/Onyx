import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotInfoDialogComponent } from './slot-info-dialog.component';

describe('SlotInfoDialogComponent', () => {
  let component: SlotInfoDialogComponent;
  let fixture: ComponentFixture<SlotInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
