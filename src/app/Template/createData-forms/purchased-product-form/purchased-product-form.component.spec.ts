import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedProductFormComponent } from './purchased-product-form.component';

describe('PurchasedProductFormComponent', () => {
  let component: PurchasedProductFormComponent;
  let fixture: ComponentFixture<PurchasedProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedProductFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasedProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
