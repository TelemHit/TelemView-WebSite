import { Component, OnInit, Input, TemplateRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-homeAboveFold',
  templateUrl: './homeAboveFold.component.html',
  styleUrls: ['./homeAboveFold.component.css']
})
export class HomeAboveFoldComponent implements OnInit {

  @Input() dataforhome;
  @Input() products;
  
  constructor() { }

  ngOnInit() {
    console.log(this.dataforhome);
  }

  scrollToElement(id): void {
   document.getElementById(id).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }


}
