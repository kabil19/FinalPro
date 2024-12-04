import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeReturnCartComponent } from './make-return-cart.component';

describe('MakeReturnCartComponent', () => {
  let component: MakeReturnCartComponent;
  let fixture: ComponentFixture<MakeReturnCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeReturnCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeReturnCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
