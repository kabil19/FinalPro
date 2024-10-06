import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCompoComponent } from './login-compo.component';

describe('LoginCompoComponent', () => {
  let component: LoginCompoComponent;
  let fixture: ComponentFixture<LoginCompoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCompoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCompoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
