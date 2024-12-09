import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainResourceComponent } from './maintain-resource.component';

describe('MaintainResourceComponent', () => {
  let component: MaintainResourceComponent;
  let fixture: ComponentFixture<MaintainResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
