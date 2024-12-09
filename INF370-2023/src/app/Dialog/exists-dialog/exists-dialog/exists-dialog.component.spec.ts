import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistsDialogComponent } from './exists-dialog.component';

describe('ExistsDialogComponent', () => {
  let component: ExistsDialogComponent;
  let fixture: ComponentFixture<ExistsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
