import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqfileAddComponent } from './faqfile-add.component';

describe('FaqfileAddComponent', () => {
  let component: FaqfileAddComponent;
  let fixture: ComponentFixture<FaqfileAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqfileAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqfileAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
