import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintActionComponent } from './print-action.component';

describe('PrintActionComponent', () => {
  let component: PrintActionComponent;
  let fixture: ComponentFixture<PrintActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
