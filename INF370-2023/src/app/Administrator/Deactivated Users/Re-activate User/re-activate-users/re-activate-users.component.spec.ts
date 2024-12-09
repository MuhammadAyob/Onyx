import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReActivateUsersComponent } from './re-activate-users.component';

describe('ReActivateUsersComponent', () => {
  let component: ReActivateUsersComponent;
  let fixture: ComponentFixture<ReActivateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReActivateUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReActivateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
