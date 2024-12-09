import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadUpdateRequestsComponent } from './read-update-requests.component';

describe('ReadUpdateRequestsComponent', () => {
  let component: ReadUpdateRequestsComponent;
  let fixture: ComponentFixture<ReadUpdateRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadUpdateRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadUpdateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
