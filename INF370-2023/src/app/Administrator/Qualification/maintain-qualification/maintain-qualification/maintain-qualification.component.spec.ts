import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainQualificationComponent } from './maintain-qualification.component';

describe('MaintainQualificationComponent', () => {
  let component: MaintainQualificationComponent;
  let fixture: ComponentFixture<MaintainQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainQualificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
