import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAnnouncementComponent } from './send-announcement.component';

describe('SendAnnouncementComponent', () => {
  let component: SendAnnouncementComponent;
  let fixture: ComponentFixture<SendAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAnnouncementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
