import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach2Component } from './approach2.component';

describe('Approach1Component', () => {
  let component: Approach2Component;
  let fixture: ComponentFixture<Approach2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Approach2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Approach2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
