import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQualificationComponent } from './view-qualification.component';

describe('ViewQualificationComponent', () => {
  let component: ViewQualificationComponent;
  let fixture: ComponentFixture<ViewQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQualificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
