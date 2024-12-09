import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadFaqComponent } from './read-faq.component';

describe('ReadFaqComponent', () => {
  let component: ReadFaqComponent;
  let fixture: ComponentFixture<ReadFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadFaqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
