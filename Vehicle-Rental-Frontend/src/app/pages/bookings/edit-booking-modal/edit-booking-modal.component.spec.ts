import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookingModalComponent } from './edit-booking-modal.component';

describe('EditBookingModalComponent', () => {
  let component: EditBookingModalComponent;
  let fixture: ComponentFixture<EditBookingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditBookingModalComponent]
    });
    fixture = TestBed.createComponent(EditBookingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
