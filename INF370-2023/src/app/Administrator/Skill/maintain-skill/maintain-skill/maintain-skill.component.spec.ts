import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSkillComponent } from './maintain-skill.component';

describe('MaintainSkillComponent', () => {
  let component: MaintainSkillComponent;
  let fixture: ComponentFixture<MaintainSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSkillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
