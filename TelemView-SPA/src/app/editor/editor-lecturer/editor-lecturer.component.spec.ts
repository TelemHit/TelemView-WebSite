/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorLecturerComponent } from './editor-lecturer.component';

describe('EditorLecturerComponent', () => {
  let component: EditorLecturerComponent;
  let fixture: ComponentFixture<EditorLecturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorLecturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorLecturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
