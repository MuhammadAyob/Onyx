import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTermsComponent } from './maintain-terms.component';

describe('MaintainTermsComponent', () => {
  let component: MaintainTermsComponent;
  let fixture: ComponentFixture<MaintainTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
