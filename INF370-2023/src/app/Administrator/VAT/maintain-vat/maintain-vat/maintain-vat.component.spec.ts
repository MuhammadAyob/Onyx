import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainVATComponent } from './maintain-vat.component';

describe('MaintainVATComponent', () => {
  let component: MaintainVATComponent;
  let fixture: ComponentFixture<MaintainVATComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainVATComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainVATComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
