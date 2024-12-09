import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadTermsComponent } from './read-terms.component';

describe('ReadTermsComponent', () => {
  let component: ReadTermsComponent;
  let fixture: ComponentFixture<ReadTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
