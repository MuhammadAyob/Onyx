import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadShortlistComponent } from './read-shortlist.component';

describe('ReadShortlistComponent', () => {
  let component: ReadShortlistComponent;
  let fixture: ComponentFixture<ReadShortlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadShortlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
