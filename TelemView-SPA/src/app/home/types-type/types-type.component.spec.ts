/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TypesTypeComponent } from './types-type.component';

describe('TypesTypeComponent', () => {
  let component: TypesTypeComponent;
  let fixture: ComponentFixture<TypesTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
