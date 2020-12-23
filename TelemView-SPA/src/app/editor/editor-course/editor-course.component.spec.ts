/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorCourseComponent } from './editor-course.component';

describe('EditorCourseComponent', () => {
  let component: EditorCourseComponent;
  let fixture: ComponentFixture<EditorCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
