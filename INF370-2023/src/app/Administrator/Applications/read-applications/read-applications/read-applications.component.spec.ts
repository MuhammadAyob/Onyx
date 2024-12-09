import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadApplicationsComponent } from './read-applications.component';

describe('ReadApplicationsComponent', () => {
  let component: ReadApplicationsComponent;
  let fixture: ComponentFixture<ReadApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
