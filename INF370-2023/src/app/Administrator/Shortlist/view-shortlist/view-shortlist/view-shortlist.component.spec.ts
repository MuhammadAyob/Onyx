import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShortlistComponent } from './view-shortlist.component';

describe('ViewShortlistComponent', () => {
  let component: ViewShortlistComponent;
  let fixture: ComponentFixture<ViewShortlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShortlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
