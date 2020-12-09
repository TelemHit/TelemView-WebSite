/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorProductsComponent } from './editor-products.component';

describe('EditorProductsComponent', () => {
  let component: EditorProductsComponent;
  let fixture: ComponentFixture<EditorProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
