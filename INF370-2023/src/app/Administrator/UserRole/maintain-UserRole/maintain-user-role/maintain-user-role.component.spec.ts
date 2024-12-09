import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainUserRoleComponent } from './maintain-user-role.component';

describe('MaintainUserRoleComponent', () => {
  let component: MaintainUserRoleComponent;
  let fixture: ComponentFixture<MaintainUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainUserRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
