import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach1Component } from './approach1.component';

describe('Approach1Component', () => {
  let component: Approach1Component;
  let fixture: ComponentFixture<Approach1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Approach1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Approach1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
