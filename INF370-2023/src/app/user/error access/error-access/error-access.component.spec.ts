import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAccessComponent } from './error-access.component';

describe('ErrorAccessComponent', () => {
  let component: ErrorAccessComponent;
  let fixture: ComponentFixture<ErrorAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
