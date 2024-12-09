import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadRequestComponent } from './read-request.component';

describe('ReadRequestComponent', () => {
  let component: ReadRequestComponent;
  let fixture: ComponentFixture<ReadRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
