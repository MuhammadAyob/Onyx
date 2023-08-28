import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMcComponent } from './read-mc.component';

describe('ReadMcComponent', () => {
  let component: ReadMcComponent;
  let fixture: ComponentFixture<ReadMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadMcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
