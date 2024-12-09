import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadSkillComponent } from './read-skill.component';

describe('ReadSkillComponent', () => {
  let component: ReadSkillComponent;
  let fixture: ComponentFixture<ReadSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadSkillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
