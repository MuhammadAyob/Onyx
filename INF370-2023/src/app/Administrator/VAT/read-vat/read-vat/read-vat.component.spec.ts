import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadVATComponent } from './read-vat.component';

describe('ReadVATComponent', () => {
  let component: ReadVATComponent;
  let fixture: ComponentFixture<ReadVATComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadVATComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadVATComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
