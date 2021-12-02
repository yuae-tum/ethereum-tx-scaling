import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach3Component } from './approach3.component';

describe('Approach3Component', () => {
  let component: Approach3Component;
  let fixture: ComponentFixture<Approach3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Approach3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Approach3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
