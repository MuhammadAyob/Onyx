import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainJobComponent } from './maintain-job.component';

describe('MaintainJobComponent', () => {
  let component: MaintainJobComponent;
  let fixture: ComponentFixture<MaintainJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
