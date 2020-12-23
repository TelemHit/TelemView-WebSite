/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorOrganizationTypesComponent } from './editor-organization-types.component';

describe('EditorOrganizationTypesComponent', () => {
  let component: EditorOrganizationTypesComponent;
  let fixture: ComponentFixture<EditorOrganizationTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorOrganizationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorOrganizationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
