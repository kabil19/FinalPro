import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectionToCartFormComponent } from './product-selection-to-cart-form.component';

describe('ProductSelectionToCartFormComponent', () => {
  let component: ProductSelectionToCartFormComponent;
  let fixture: ComponentFixture<ProductSelectionToCartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSelectionToCartFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSelectionToCartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
