import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainUpdateRequestComponent } from './maintain-update-request.component';

describe('MaintainUpdateRequestComponent', () => {
  let component: MaintainUpdateRequestComponent;
  let fixture: ComponentFixture<MaintainUpdateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainUpdateRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainUpdateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
