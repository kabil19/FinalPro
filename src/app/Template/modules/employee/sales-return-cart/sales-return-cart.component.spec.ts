import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnCartComponent } from './sales-return-cart.component';

describe('SalesReturnCartComponent', () => {
  let component: SalesReturnCartComponent;
  let fixture: ComponentFixture<SalesReturnCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReturnCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReturnCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
