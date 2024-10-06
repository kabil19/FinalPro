import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedPurchaseComponent } from './confirmed-purchase.component';

describe('ConfirmedPurchaseComponent', () => {
  let component: ConfirmedPurchaseComponent;
  let fixture: ComponentFixture<ConfirmedPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
