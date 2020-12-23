/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorStudentComponent } from './editor-student.component';

describe('EditorStudentComponent', () => {
  let component: EditorStudentComponent;
  let fixture: ComponentFixture<EditorStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
