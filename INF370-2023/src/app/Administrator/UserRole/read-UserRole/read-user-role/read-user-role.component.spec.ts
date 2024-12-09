import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadUserRoleComponent } from './read-user-role.component';

describe('ReadUserRoleComponent', () => {
  let component: ReadUserRoleComponent;
  let fixture: ComponentFixture<ReadUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadUserRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
