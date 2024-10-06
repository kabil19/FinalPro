import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFinalizationComponent } from './invoice-finalization.component';

describe('InvoiceFinalizationComponent', () => {
  let component: InvoiceFinalizationComponent;
  let fixture: ComponentFixture<InvoiceFinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceFinalizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
