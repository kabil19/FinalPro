import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectionToCartComponent } from './product-selection-to-cart.component';

describe('ProductSelectionToCartComponent', () => {
  let component: ProductSelectionToCartComponent;
  let fixture: ComponentFixture<ProductSelectionToCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSelectionToCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSelectionToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
