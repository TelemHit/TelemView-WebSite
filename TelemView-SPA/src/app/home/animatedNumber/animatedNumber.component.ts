import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-animatedNumber',
  templateUrl: './animatedNumber.component.html',
  styleUrls: ['./animatedNumber.component.css']
})
export class AnimatedNumberComponent implements OnInit {
  @Input() typeCounter;
  @ViewChild("animatedDigit") animatedDigit: ElementRef;
  duration = 1000;
  steps = 12;
  constructor() { }

  ngOnInit() {

  }

}
