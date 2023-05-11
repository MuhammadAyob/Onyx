import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkillTypeComponent } from './view-skill-type.component';

describe('ViewSkillTypeComponent', () => {
  let component: ViewSkillTypeComponent;
  let fixture: ComponentFixture<ViewSkillTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSkillTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSkillTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
