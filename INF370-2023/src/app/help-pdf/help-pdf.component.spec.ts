import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPdfComponent } from './help-pdf.component';

describe('HelpPdfComponent', () => {
  let component: HelpPdfComponent;
  let fixture: ComponentFixture<HelpPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
