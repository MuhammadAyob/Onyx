import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadRatingsComponent } from './read-ratings.component';

describe('ReadRatingsComponent', () => {
  let component: ReadRatingsComponent;
  let fixture: ComponentFixture<ReadRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadRatingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
