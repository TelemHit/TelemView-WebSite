import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-numberOfTypes',
  templateUrl: './numberOfTypes.component.html',
  styleUrls: ['./numberOfTypes.component.css']
})
export class NumberOfTypesComponent implements OnInit {
  @Input() dataforhome;
  sortedTypes = [];

  constructor() { }

  ngOnInit() {
    this.sortedTypes = this.dataforhome.sort((a, b) => parseFloat(b.counter) - parseFloat(a.counter))
    .filter(obj => obj.counter !== 0)
    .slice(0, 5);

    console.log(this.sortedTypes);
  }

}
