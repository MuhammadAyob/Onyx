import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentNotifyComponent } from './student-notify.component';

describe('StudentNotifyComponent', () => {
  let component: StudentNotifyComponent;
  let fixture: ComponentFixture<StudentNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
