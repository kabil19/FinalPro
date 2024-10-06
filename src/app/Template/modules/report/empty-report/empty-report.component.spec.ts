import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyReportComponent } from './empty-report.component';

describe('EmptyReportComponent', () => {
  let component: EmptyReportComponent;
  let fixture: ComponentFixture<EmptyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
