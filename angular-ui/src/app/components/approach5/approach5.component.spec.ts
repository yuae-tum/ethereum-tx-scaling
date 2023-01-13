import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approach5Component } from './approach5.component';

describe('Approach5Component', () => {
  let component: Approach5Component;
  let fixture: ComponentFixture<Approach5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Approach5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Approach5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
