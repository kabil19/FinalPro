import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDiscountComponent } from './main-discount.component';

describe('MainDiscountComponent', () => {
  let component: MainDiscountComponent;
  let fixture: ComponentFixture<MainDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
