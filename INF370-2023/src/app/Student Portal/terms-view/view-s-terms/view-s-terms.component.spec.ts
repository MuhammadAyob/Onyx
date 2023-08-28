import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSTermsComponent } from './view-s-terms.component';

describe('ViewSTermsComponent', () => {
  let component: ViewSTermsComponent;
  let fixture: ComponentFixture<ViewSTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
