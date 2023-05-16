import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSkillTypeComponent } from './maintain-skill-type.component';

describe('MaintainSkillTypeComponent', () => {
  let component: MaintainSkillTypeComponent;
  let fixture: ComponentFixture<MaintainSkillTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSkillTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainSkillTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
