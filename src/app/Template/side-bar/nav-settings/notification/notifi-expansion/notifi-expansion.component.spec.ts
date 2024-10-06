import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiExpansionComponent } from './notifi-expansion.component';

describe('NotifiExpansionComponent', () => {
  let component: NotifiExpansionComponent;
  let fixture: ComponentFixture<NotifiExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifiExpansionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifiExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
