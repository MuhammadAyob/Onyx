import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudentHomeComponent } from './sudent-home.component';

describe('SudentHomeComponent', () => {
  let component: SudentHomeComponent;
  let fixture: ComponentFixture<SudentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SudentHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
