import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainRequestComponent } from './maintain-request.component';

describe('MaintainRequestComponent', () => {
  let component: MaintainRequestComponent;
  let fixture: ComponentFixture<MaintainRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
