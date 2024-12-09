import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkillComponent } from './view-skill.component';

describe('ViewSkillComponent', () => {
  let component: ViewSkillComponent;
  let fixture: ComponentFixture<ViewSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSkillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
