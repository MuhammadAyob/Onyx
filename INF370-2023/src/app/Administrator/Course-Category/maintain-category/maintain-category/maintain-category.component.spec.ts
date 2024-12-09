import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCategoryComponent } from './maintain-category.component';

describe('MaintainCategoryComponent', () => {
  let component: MaintainCategoryComponent;
  let fixture: ComponentFixture<MaintainCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
