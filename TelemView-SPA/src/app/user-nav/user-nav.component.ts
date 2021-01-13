import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  staticNav=false;
  mobileNav=false;
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
  //In chrome and some browser scroll is given to body tag
  let pos = (document.documentElement.scrollTop || document.body.scrollTop);
  // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
   if(pos >= 200 )   {
   this.staticNav=true;
   this.mobileNav=false;
   }
   else{
     this.staticNav=false;
   }
  }
  constructor() { }

  ngOnInit() {
  }

}
