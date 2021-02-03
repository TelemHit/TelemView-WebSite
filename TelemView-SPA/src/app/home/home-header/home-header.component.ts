import { Component, OnInit, Input, TemplateRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  @Input() dataforhome;
  @Input() products;
  
  constructor() { }

  ngOnInit() {
  }

}
