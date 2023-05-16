import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillTypeComponent } from './add-skill-type.component';

describe('AddSkillTypeComponent', () => {
  let component: AddSkillTypeComponent;
  let fixture: ComponentFixture<AddSkillTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSkillTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkillTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
