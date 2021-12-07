import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach4Component } from './approach4.component';

describe('Approach4Component', () => {
  let component: Approach4Component;
  let fixture: ComponentFixture<Approach4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Approach4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Approach4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
