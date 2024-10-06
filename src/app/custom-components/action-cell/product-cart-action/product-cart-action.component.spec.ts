import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCartActionComponent } from './product-cart-action.component';

describe('ProductCartActionComponent', () => {
  let component: ProductCartActionComponent;
  let fixture: ComponentFixture<ProductCartActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCartActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCartActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
