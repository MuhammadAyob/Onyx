import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadInvoicesComponent } from './read-invoices.component';

describe('ReadInvoicesComponent', () => {
  let component: ReadInvoicesComponent;
  let fixture: ComponentFixture<ReadInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
