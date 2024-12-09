import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadSkillTypeComponent } from './read-skill-type.component';

describe('ReadSkillTypeComponent', () => {
  let component: ReadSkillTypeComponent;
  let fixture: ComponentFixture<ReadSkillTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadSkillTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadSkillTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
