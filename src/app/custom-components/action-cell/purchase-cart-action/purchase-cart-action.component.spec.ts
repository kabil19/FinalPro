import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCartActionComponent } from './purchase-cart-action.component';

describe('PurchaseCartActionComponent', () => {
  let component: PurchaseCartActionComponent;
  let fixture: ComponentFixture<PurchaseCartActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCartActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCartActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
