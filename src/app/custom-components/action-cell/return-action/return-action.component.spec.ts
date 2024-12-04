import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnActionComponent } from './return-action.component';

describe('ReturnActionComponent', () => {
  let component: ReturnActionComponent;
  let fixture: ComponentFixture<ReturnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
