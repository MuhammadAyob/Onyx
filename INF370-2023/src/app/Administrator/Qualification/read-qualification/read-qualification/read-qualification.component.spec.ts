import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadQualificationComponent } from './read-qualification.component';

describe('ReadQualificationComponent', () => {
  let component: ReadQualificationComponent;
  let fixture: ComponentFixture<ReadQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadQualificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
