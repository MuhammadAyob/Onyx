import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainFaqComponent } from './maintain-faq.component';

describe('MaintainFaqComponent', () => {
  let component: MaintainFaqComponent;
  let fixture: ComponentFixture<MaintainFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainFaqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
