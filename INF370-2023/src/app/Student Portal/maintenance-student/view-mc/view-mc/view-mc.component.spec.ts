import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMcComponent } from './view-mc.component';

describe('ViewMcComponent', () => {
  let component: ViewMcComponent;
  let fixture: ComponentFixture<ViewMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
