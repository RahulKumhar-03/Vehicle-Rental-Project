import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMaintenanceModalComponent } from './create-maintenance-modal.component';

describe('CreateMaintenanceModalComponent', () => {
  let component: CreateMaintenanceModalComponent;
  let fixture: ComponentFixture<CreateMaintenanceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateMaintenanceModalComponent]
    });
    fixture = TestBed.createComponent(CreateMaintenanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
