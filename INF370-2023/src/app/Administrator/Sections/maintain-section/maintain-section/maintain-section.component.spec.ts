import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSectionComponent } from './maintain-section.component';

describe('MaintainSectionComponent', () => {
  let component: MaintainSectionComponent;
  let fixture: ComponentFixture<MaintainSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
