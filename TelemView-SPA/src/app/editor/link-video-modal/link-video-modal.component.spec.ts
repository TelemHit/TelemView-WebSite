/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinkVideoModalComponent } from './link-video-modal.component';

describe('LinkVideoModalComponent', () => {
  let component: LinkVideoModalComponent;
  let fixture: ComponentFixture<LinkVideoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkVideoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkVideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
