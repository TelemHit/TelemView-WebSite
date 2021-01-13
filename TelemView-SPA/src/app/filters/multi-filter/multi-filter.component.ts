import { Component, OnInit, Input, Pipe, PipeTransform, ElementRef, ViewChild } from '@angular/core';
import { DataForHome } from 'src/app/_models/dataForHome';
import { ProductsService } from 'src/app/_services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value): any {
    if (!value) {
      return null;
    } else {
      return Object.keys(value);
    }
  }
}

@Component({
  selector: 'app-multi-filter',
  templateUrl: './multi-filter.component.html',
  styleUrls: ['./multi-filter.component.css'],
})
export class MultiFilterComponent implements OnInit {
  selectedParams = {
    tasks: [],
    organizations: [],
    productTypes: [],
    organizationTypes: [],
    lecturers: [],
    courses: [],
    degree: [],
    years: [],
    search:[]
  };
  // someValue = '';
  modelChanged: Subject<string> = new Subject<string>();
  debounceTime = 500;
  isFocused = false;
  queryParams;
  openMoreFilters=false;
  mobileSearch=false;
  mobileFilters=false;

 @Input() totalProducts: number;
  @Input() data: DataForHome;
  @ViewChild('search') searchElement: ElementRef;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.updateSearch();
    });
    
  }

  ngOnInit() {
    this.getQueryParams();
  }
//set focus on search input
  showSearch(){
    this.mobileSearch=!this.mobileSearch;
    this.mobileFilters=false
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.searchElement.nativeElement.focus();
    },0);  
  }

getQueryParams(){
  // get params from query
  this.route.queryParamMap.subscribe((params) => {
    this.queryParams=params;
    // set selected params according to query
    for (const [key, value] of Object.entries(params['params'])) {
      // check that the param in the query is relevant
      if (this.selectedParams[key] != undefined) {  
        // make sure param is empty
        if (this.selectedParams[key].length == 0) {
          const newValue: any = value;
          // if param is string push it, if array - loop and push
          if (typeof newValue == 'string') {
            if(key=='degree' || key=='search'){
              this.selectedParams[key].push(newValue.toString());
            }else{
              this.selectedParams[key].push(parseInt(newValue));
            }
          } else {
            for (let id of newValue) {
              this.selectedParams[key].push(parseInt(id));
            }
          }
        }
      }
    }
  });
}

  filtered(data) {
    return data.filter((d) => d.counter > 0);
  }
  clear(select, filter){
    select.close();
    this.selectedParams[filter]=[];
    if(this.queryParams.params[filter] && this.queryParams.params[filter].length>0){
      this.updateQueryParameters(filter);
    }
  }
  closeSelect(select, filter){
    select.close();
    if((this.queryParams.params[filter] && this.queryParams.params[filter].length>0) || this.selectedParams[filter].length>0){
    this.updateQueryParameters(filter);
    }
  }
  updateOnBlur(filter){
    if((this.queryParams.params[filter] && this.queryParams.params[filter].length>0) || this.selectedParams[filter].length>0){
      this.updateQueryParameters(filter)
    };  
  }
  updateQueryParameters(filter) {
    const params = {...this.selectedParams};
    for (const property in params) {
      if(params[property]){
        if (params[property].length == 0 && property != filter){
          delete params[property];
        }
      }
    }
    if(params.search != undefined){
      if(params.search[0].length==0){
        delete params.search;
      }
      
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  clearSearch() {
    const params = { ...this.route.snapshot.queryParams };
        delete params.search;
        this.router.navigate([], { queryParams: params });
        this.selectedParams.search = [];
  }
  modelChange() {
    this.modelChanged.next();
  }
  updateSearch() {
    this.updateQueryParameters('search');
  }

  clearall(){
    const params = { ...this.route.snapshot.queryParams };
    for (const [key, value] of Object.entries(params)){
      if(key != 'search'){
        delete params[key];
      }
    };
    this.router.navigate([], {
      queryParams: params,
    });
    this.selectedParams = {
      tasks: [],
      organizations: [],
      productTypes: [],
      organizationTypes: [],
      lecturers: [],
      courses: [],
      degree: [],
      years: [],
      search: this.selectedParams.search
    };
  }

  filtersActive(){
    const params = { ...this.route.snapshot.queryParams };
    for (const [key, value] of Object.entries(params)){
      if(params[key].length>0 && key != 'search') {
        return true
      }
    } 
      return false;
  }
}
