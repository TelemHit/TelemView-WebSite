import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-typesType',
  templateUrl: './typesType.component.html',
  styleUrls: ['./typesType.component.css']
})
export class TypesTypeComponent implements OnInit {

  constructor() { }

   @Input() productTypes;
  productTypesArray = ['לומדות', 'אתרי אינטרנט', 'אפליקציות', 'מחוללי תוכן', 'מחוללי משחקים', 'משחקים לימודיים',
   'סימולציות', 'אינפוגרפיקות', 'רובוטים חברתיים'];
  mapProduct = [];
  // Current sentence being processed
  part = 0;
  // Character number of the current sentence being processed
  partIndex = 0;
  // Holds the handle returned from setInterval
  intervalVal: any;
  // Element that holds the text
  element = '';
  // Cursor element
  cursor: any;

  self = this;

  ngOnInit() {
    console.log(this);
    // this.mapProduct = this.productTypes.map(x => x.title);

  }
  ngAfterViewInit(){
    console.log(this);
    // Start the typing effect on load
    this.intervalVal = setInterval(() => {this.type(); }, 200);
  }

  // Implements typing effect
  type(): any {
    // Get substring with 1 characater added
    let curType = this.productTypesArray[this.part];
    const text =  curType.substring(0, this.partIndex + 1);
    this.element = text;
    this.partIndex++;
  // If full sentence has been displayed then start to delete the sentence after some time
    if (text === curType) {
      clearInterval(this.intervalVal);
      setTimeout(() => {
        this.intervalVal = setInterval(() => {this.delete(); }, 100);
      }, 2000);
    }
  }

  // Implements deleting effect
  delete(): any {
  let curType = this.productTypesArray[this.part];
  // Get substring with 1 characater deleted
  const text =  curType.substring(0, this.partIndex - 1);
  this.element = text;
  this.partIndex--;

  // If sentence has been deleted then start to display the next sentence
  if (text === '') {
    clearInterval(this.intervalVal);
    // If current sentence was last then display the first one, else move to the next
    if (this.part === (this.productTypesArray.length - 1)) {
      this.part = 0;
    }
    else {
      this.part++;
    }
    this.partIndex = 0;

    // Start to display the next sentence after some time
    setTimeout(() => {
      this.intervalVal = setInterval(() => {this.type(); }, 100);
    }, 500);
  }
}
ngOnDestroy(){
  clearInterval(this.intervalVal);
}
}
